//
//  RNHealthTracker.swift
//  RNFitnessTracker
//
//  Created by Matas on 2022-02-10.
//  Copyright © 2022 Facebook. All rights reserved.
//

import React
import Foundation
import HealthKit

@objc(RNHealthTracker)
class RNHealthTracker: NSObject {
    private let healthStore: HKHealthStore = HKHealthStore()
    private let QUERY_TIMEOUT_IN_SECONDS = 30.0

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

    private func formatHKQuantityTypeIdentifier(_ dataKey: String) -> String {
        "HKQuantityTypeIdentifier\(dataKey)"
    }

    private func transformDataKeyToHKQuantityType(_ dataKey: String) -> HKQuantityType? {
        HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: formatHKQuantityTypeIdentifier(dataKey)))
    }

    private func transformDataKeyToHKSampleType(_ dataKey: String) -> HKSampleType? {
        if dataKey == "Workout" {
            return HKSampleType.workoutType()
        } else {
            return HKSampleType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: formatHKQuantityTypeIdentifier(dataKey)))
        }
    }

    private func transformDataKeyToHKObject(_ dataKey: String) -> HKObjectType? {
        if dataKey == "Workout" {
            return HKObjectType.workoutType()
        } else {
            return HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: formatHKQuantityTypeIdentifier(dataKey)))
        }
    }

    private func standardErrorCode(_ code: Int?) -> String? {
        let descriptions = [
            "E_UNKNOWN",
            "E_DEVELOPER_ERROR",
            "E_EXECUTING_QUERY",
            "E_DEVICE_NOT_SUPPORTED",
            "E_DATABASE_INACCESSIBLE",
            "E_AUTHORIZATION_NOT_DETERMINED"
        ]
        guard let code = code else {
            return descriptions[0]
        }

        if code > descriptions.count - 1 {
            return descriptions[0]
        }
        return descriptions[code]
    }

    private func handleError(
        reject: @escaping RCTPromiseRejectBlock,
        code errorCode: Int? = nil,
        description errorDescription: String? = nil,
        error: Error? = nil
    ) {
        let authorizationNotDetermined = error?.localizedDescription == "Authorization not determined"
        let code = standardErrorCode(authorizationNotDetermined ? 5 : errorCode)
        let description = errorDescription ?? error?.localizedDescription

        reject(code, description, error)
    }

    private func isCumulative(quantityType: HKQuantityType, reject: @escaping RCTPromiseRejectBlock) -> Bool {
        let isCumulative = quantityType.aggregationStyle == .cumulative
        if !isCumulative {
            handleError(reject: reject, code: 1, description: "Invalid dataTypeIdentifier. HKQuantityType aggregation style must be cumulative")
        }

        return isCumulative
    }

    private func generateCollectionQuery(
        dataTypeIdentifier: String,
        startDate start: Date,
        endDate end: Date,
        reject: @escaping RCTPromiseRejectBlock
    ) -> HKStatisticsCollectionQuery? {
        var interval: DateComponents = DateComponents()
        interval.day = 1

        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            handleError(reject: reject, code: 1, description: "Invalid dataTypeIdentifier.")
            return nil
        }

        if (!isCumulative(quantityType: quantityType, reject: reject)) { return nil }

        let query = HKStatisticsCollectionQuery(quantityType: quantityType,
                                                quantitySamplePredicate: nil,
                                                options: .cumulativeSum,
                                                anchorDate: start,
                                                intervalComponents: interval)

        return query
    }

    private func generateSampleQuery(
        dataTypeIdentifier: String,
        startDate start: Date?,
        endDate end: Date?,
        ascending: Bool,
        limit: Int?,
        reject: @escaping RCTPromiseRejectBlock,
        resultsHandler: @escaping (HKSampleQuery, [HKSample]?, Error?) -> Void
    ) -> HKSampleQuery? {
        guard let sampleType = transformDataKeyToHKSampleType(dataTypeIdentifier) else {
            handleError(reject: reject, code: 1, description: "Invalid dataTypeIdentifier.")
            return nil
        }

        var predicate: NSPredicate? = nil
        if (start != nil || end != nil) {
            predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: HKQueryOptions(rawValue: 0))
        }

        let sortDescriptor: NSSortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending)

        let sampleQuery: HKSampleQuery = HKSampleQuery.init(
            sampleType: sampleType,
            predicate: predicate,
            limit: limit ?? HKObjectQueryNoLimit,
            sortDescriptors: [sortDescriptor],
            resultsHandler: resultsHandler
        )

        return sampleQuery
    }

    @objc public func getReadStatus(
        _ dataTypeIdentifier: String,
        unit: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let currentDate = Date()
        let start: Date? = RNFitnessUtils.daysAgo(date: currentDate, 720)
        let end: Date? = RNFitnessUtils.endOfDay(date: currentDate)

        guard let sampleQuery = generateSampleQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: start,
            endDate: end,
            ascending: true,
            limit: 1,
            reject: reject,
            resultsHandler: {
                (query: HKSampleQuery, samples: [HKSample]?, error: Error?) in

                if let error = error {
                    if error.localizedDescription == "Authorization not determined" {
                        resolve(0)
                    } else {
                        self.handleError(reject: reject, code: 2, error: error)
                    }

                    return
                }

                guard let samples = samples as? [HKQuantitySample] else {
                    self.handleError(reject: reject, description: "Error getting samples as HKQuantitySample")
                    return
                }

                var quantitySum = 0.0;
                for sample in samples {
                    let value: Double = sample.quantity.doubleValue(for: HKUnit.init(from: unit))
                    quantitySum += value
                }

                if quantitySum > 0 {
                    resolve(2)
                } else {
                    resolve(1)
                }
            }
        ) else { return }

        healthStore.execute(sampleQuery)
    }

    @objc public func authorize(
        _ shareTypes: [String],
        readTypes: [String],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        if !HKHealthStore.isHealthDataAvailable() {
            self.handleError(reject: reject, code: 3, description: "Health data is not supported on this device.")
            return
        }

        var read: Set<HKSampleType>? = nil
        var toShare: Set<HKSampleType>? = nil

        if !readTypes.isEmpty {
            read = Set()

            for dataType in readTypes {
                guard let object: HKSampleType = transformDataKeyToHKSampleType(dataType) else {
                    handleError(reject: reject, code: 1, description: "Invalid read dataTypes.")
                    return
                }
                read!.insert(object)
            }
        }

        if !shareTypes.isEmpty {
            toShare = Set()

            for dataType in shareTypes {
                guard let object: HKSampleType = transformDataKeyToHKSampleType(dataType) else {
                    handleError(reject: reject, code: 1, description: "Invalid share dataTypes.")
                    return
                }
                toShare!.insert(object)
            }
        }

        healthStore.requestAuthorization(toShare: toShare, read: read) { success, error in
            if let error = error {
                self.handleError(reject: reject, error: error)
            } else {
                resolve(true)
            }
        }
    }

    @objc public func getStatisticTotalForToday(
        _ dataTypeIdentifier: String,
        unit: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let currentDate = Date()
        let start: Date = RNFitnessUtils.startOfDay(date: currentDate)
        let end: Date = RNFitnessUtils.endOfDay(date: start)

        guard let query = generateCollectionQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: start,
            endDate: end,
            reject: reject
        ) else { return }

        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in
            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    self.handleError(reject: reject, code: 4, error: error)
                    return
                default:
                    self.handleError(reject: reject, error: error)
                    return
                }
            }

            guard let statsCollection = results else {
                self.handleError(reject: reject, description: "Unhandled error getting results.", error: error)
                return
            }

            statsCollection.enumerateStatistics(from: start, to: end) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                guard let quantity: HKQuantity = result.sumQuantity() else {
                    resolve(0)
                    return
                }

                let value: Double = quantity.doubleValue(for: HKUnit.init(from: unit))
                resolve(value.rounded(toPlaces: 2))
            }
        }

        healthStore.execute(query)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(query)
        }
    }

    @objc public func getStatisticTotalForWeek(
        _ dataTypeIdentifier: String,
        unit: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let currentDate = Date()
        let end: Date = RNFitnessUtils.endOfDay(date: currentDate)
        let start: Date = RNFitnessUtils.startOfXDaysAgo(date: end, numberOfDays: 6)

        guard let query = generateCollectionQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: start,
            endDate: end,
            reject: reject
        ) else { return }

        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in

            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    self.handleError(reject: reject, code: 4, error: error)
                    return
                default:
                    self.handleError(reject: reject, error: error)
                    return
                }
            }

            guard let statsCollection = results else {
                self.handleError(reject: reject, description: "Unhandled error getting results.", error: error)
                return
            }

            var total: Double = 0;

            statsCollection.enumerateStatistics(from: start, to: end) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                if let quantity: HKQuantity = result.sumQuantity() {
                    let value: Double = quantity.doubleValue(for: HKUnit.init(from: unit))
                    total += value;
                }
            }

            if unit == HKUnit.count().unitString {
                resolve(Int(total))
            } else {
                resolve(total.rounded(toPlaces: 2))
            }
        }

        healthStore.execute(query)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(query)
        }
    }

    @objc public func queryTotal(
        _ dataTypeIdentifier: String,
        unit: String,
        start: NSNumber,
        end: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {

        let startDate = RNFitnessUtils.getDateFrom(timestamp: start.intValue)
        let endDate = RNFitnessUtils.getDateFrom(timestamp: end.intValue)

        guard let query = generateCollectionQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: startDate,
            endDate: endDate,
            reject: reject
        ) else { return }

        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in

            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    self.handleError(reject: reject, code: 4, error: error)
                    return
                default:
                    self.handleError(reject: reject, error: error)
                    return
                }
            }

            guard let statsCollection = results else {
                self.handleError(reject: reject, description: "Unhandled error getting results.", error: error)
                return
            }

            var total: Double = 0;

            statsCollection.enumerateStatistics(from: startDate, to: endDate) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                if let quantity: HKQuantity = result.sumQuantity() {
                    let value: Double = quantity.doubleValue(for: HKUnit.init(from: unit))
                    total += value;
                }
            }

            if unit == HKUnit.count().unitString {
                resolve(Int(total))
            } else {
                resolve(total.rounded(toPlaces: 2))
            }
        }

        healthStore.execute(query)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(query)
        }
    }

    @objc public func getStatisticWeekDaily(
        _ dataTypeIdentifier: String,
        unit: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let currentDate = Date()
        let end = RNFitnessUtils.endOfDay(date: currentDate)
        let start = RNFitnessUtils.startOfXDaysAgo(date: end, numberOfDays: 6)

        guard let query = generateCollectionQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: start,
            endDate: end,
            reject: reject
        ) else { return }

        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in

            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    self.handleError(reject: reject, code: 4, error: error)
                    return
                default:
                    self.handleError(reject: reject, error: error)
                    return
                }
            }



            guard let statsCollection = results else {
                self.handleError(reject: reject, description: "Unhandled error getting results.", error: error)
                return
            }

            var data: [String: Any] = [:]

            statsCollection.enumerateStatistics(from: start, to: end) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                let dateString = RNFitnessUtils.formatIsoDateString(result.startDate)

                if let quantity: HKQuantity = result.sumQuantity() {
                    var value: Any = quantity.doubleValue(for: HKUnit.init(from: unit))

                    if unit == HKUnit.count().unitString {
                        value = Int(value as! Double);
                    } else {
                        value = (value as! Double).rounded(toPlaces: 2)
                    }

                    data[dateString] = value;
                } else {
                    data[dateString] = 0;
                }
            }

            resolve(data);
        }

        healthStore.execute(query)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(query)
        }
    }

    @objc public func queryDailyTotals(
        _ dataTypeIdentifier: String,
        unit: String,
        start: NSNumber,
        end: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let startDate: Date = RNFitnessUtils.getDateFrom(timestamp: start.intValue)
        let endDate: Date = RNFitnessUtils.getDateFrom(timestamp: end.intValue)

        guard let query = generateCollectionQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: startDate,
            endDate: endDate,
            reject: reject
        ) else { return }

        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in

            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    self.handleError(reject: reject, code: 4, error: error)
                    return
                default:
                    self.handleError(reject: reject, error: error)
                    return
                }
            }

            guard let statsCollection = results else {
                self.handleError(reject: reject, description: "Unhandled error getting results.", error: error)
                return
            }

            var data: [String: Any] = [:]

            statsCollection.enumerateStatistics(from: startDate, to: endDate) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                if let quantity: HKQuantity = result.sumQuantity() {
                    let dateString = RNFitnessUtils.formatIsoDateString(result.startDate)

                    var value: Any = quantity.doubleValue(for: HKUnit.init(from: unit))

                    if unit == HKUnit.count().unitString {
                        value = Int(value as! Double);
                    } else {
                        value = (value as! Double).rounded(toPlaces: 2)
                    }

                    data[dateString] = value;
                }
            }

            resolve(data);
        }

        healthStore.execute(query)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(query)
        }
    }

    @objc public func writeData(
        _ dataTypeIdentifier: String,
        unit: String,
        amount: NSNumber,
        metadata: Dictionary<String, Any>,
        timestamp: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {

        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            return handleError(reject: reject, code: 1, description: "Invalid dataTypeIdentifier.")
        }

        let quantity: HKQuantity = HKQuantity.init(unit: HKUnit.init(from: unit), doubleValue: amount.doubleValue)
        var date: Date = Date()
        if timestamp.intValue != -1 {
            date = RNFitnessUtils.getDateFrom(timestamp: timestamp.intValue)
        }

        let dataObject: HKQuantitySample = HKQuantitySample.init(type: quantityType, quantity: quantity, start: date, end: date, metadata: metadata)

        healthStore.save(dataObject) { success, error in
            if let error = error {
                self.handleError(reject: reject, error: error)
            } else {
                resolve(success)
            }
        }
    }

    @objc public func writeDataArray(
        _ dataArray: NSArray,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {

        if dataArray.count > 0 {
            var dataArrayTransformed: [HKQuantitySample] = []

            for (index, obj) in dataArray.enumerated() {

                guard let obj = obj as? NSDictionary else {
                    return handleError(reject: reject, code: 1, description: "Wrong data passed to RNHealthTracker:writeDataArray")
                }

                guard let dataTypeIdentifier: String = (obj["key"] as? String),
                      let unit: String = (obj["unit"] as? String),
                      let amount: NSNumber = (obj["amount"] as? NSNumber)
                else {
                    return handleError(reject: reject, code: 1, description: "Wrong data passed to RNHealthTracker:writeDataArray, dataArray id \(index)")
                }

                let metadata: Dictionary<String, Any> = (obj["metadata"] as? Dictionary<String, Any>) ?? [:]

                var date: Date = Date()
                if let timestamp: NSNumber = (obj["timestamp"] as? NSNumber) {
                    date = RNFitnessUtils.getDateFrom(timestamp: timestamp.intValue)
                }

                guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
                    return handleError(reject: reject, code: 1, description: "Invalid dataTypeIdentifier.")
                }

                let quantity: HKQuantity = HKQuantity.init(unit: HKUnit.init(from: unit), doubleValue: amount.doubleValue)

                let dataObject: HKQuantitySample = HKQuantitySample.init(type: quantityType, quantity: quantity, start: date, end: date, metadata: metadata)

                dataArrayTransformed.append(dataObject)
            }

            healthStore.save(dataArrayTransformed)  { success, error in
                if let error = error {
                    self.handleError(reject: reject, error: error)
                } else {
                    resolve(success)
                }
            }
        } else {
            return handleError(reject: reject, code: 1, description: "Empty array was passed.")
        }
    }

    @objc public func queryDataRecords(
        _ dataTypeIdentifier: String,
        unit: String,
        start: NSNumber,
        end: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let startDate = RNFitnessUtils.getDateFrom(timestamp: start.intValue)
        let endDate = RNFitnessUtils.getDateFrom(timestamp: end.intValue)

        guard let sampleQuery = generateSampleQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: startDate,
            endDate: endDate,
            ascending: true,
            limit: nil,
            reject: reject,
            resultsHandler: { (query: HKSampleQuery, samples: [HKSample]?, error: Error?) in

                if let error = error {
                    return self.handleError(reject: reject, code: 2, error: error)
                }

                var dataRecords: [Dictionary<String, Any?>] = []

                guard let samples = samples as? [HKQuantitySample] else {
                    self.handleError(reject: reject, description: "Error getting samples as HKQuantitySample")
                    return
                }

                for sample in samples {
                    let isoDate = RNFitnessUtils.formatUtcIsoDateTimeString(sample.endDate)

                    let sourceDevice: String = sample.sourceRevision.productType ?? "unknown"

                    let quantity: Double = sample.quantity.doubleValue(for: HKUnit.init(from: unit))

                    dataRecords.append([
                        "uuid": sample.uuid.uuidString,
                        "date": isoDate,
                        "quantity": quantity,
                        "metadata": sample.metadata,
                        "source": [
                            "name": sample.sourceRevision.source.name,
                            "device": sourceDevice,
                            "version": sample.sourceRevision.version,
                            "id": sample.sourceRevision.source.bundleIdentifier,
                        ]
                    ])
                }

                resolve(dataRecords);
            }
        ) else { return }

        healthStore.execute(sampleQuery)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(sampleQuery)
        }
    }

    @objc public func getLatestDataRecord(
        _ dataTypeIdentifier: String,
        unit: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        guard let sampleQuery = generateSampleQuery(
            dataTypeIdentifier: dataTypeIdentifier,
            startDate: nil,
            endDate: nil,
            ascending: false,
            limit: 1,
            reject: reject,
            resultsHandler: { (query: HKSampleQuery, samples: [HKSample]?, error: Error?) in

                if let error = error {
                    return self.handleError(reject: reject, code: 2, error: error)
                }

                guard let samples = samples as? [HKQuantitySample] else {
                    return self.handleError(reject: reject, description: "Error getting samples as HKQuantitySample")
                }

                var dataRecords: Dictionary<String, Any?>

                if samples.isEmpty {
                    return resolve(nil)
                }

                let sample = samples[0]

                let isoDate = RNFitnessUtils.formatUtcIsoDateTimeString(sample.endDate)

                let sourceDevice: String = sample.sourceRevision.productType ?? "unknown"

                let quantity: Double = sample.quantity.doubleValue(for: HKUnit.init(from: unit))

                dataRecords = [
                    "uuid": sample.uuid.uuidString,
                    "date": isoDate,
                    "quantity": quantity,
                    "metadata": sample.metadata,
                    "source": [
                        "name": sample.sourceRevision.source.name,
                        "device": sourceDevice,
                        "version": sample.sourceRevision.version,
                        "id": sample.sourceRevision.source.bundleIdentifier,
                    ]
                ]

                resolve(dataRecords)
            }
        ) else { return }

        healthStore.execute(sampleQuery)
    }

    @objc public func writeWorkout(
        _ workoutWithActivityType: NSNumber,
        start: NSNumber,
        end: NSNumber,
        energyBurned: NSNumber,
        distance: NSNumber,
        metadata: Dictionary<String, Any>,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let startDate: Date = RNFitnessUtils.getDateFrom(timestamp: start.intValue)
        let endDate: Date = RNFitnessUtils.getDateFrom(timestamp: end.intValue)
        let totalEnergyBurned: HKQuantity = HKQuantity.init(unit: .kilocalorie(), doubleValue: energyBurned.doubleValue)

        let totalDistance: HKQuantity = HKQuantity.init(unit: .meter(), doubleValue: distance.doubleValue)
        guard let activityType = HKWorkoutActivityType.init(rawValue: workoutWithActivityType.uintValue) else {
            return handleError(reject: reject, code: 1, description: "Invalid workoutWithActivityType.")
        }

        let workout: HKWorkout = HKWorkout.init(
            activityType: activityType,
            start: startDate,
            end: endDate,
            duration: 0,
            totalEnergyBurned: totalEnergyBurned,
            totalDistance: totalDistance,
            metadata: metadata
        )

        healthStore.save(workout) { success, error in
            // TODO make this seperate function
            if let error = error {
                self.handleError(reject: reject, error: error)
            } else {
                resolve(success)
            }
        }
    }

    @objc public func anchoredQueryWorkouts(
        _ workoutActivityType: NSNumber,
        lastAnchor: NSNumber,
        limit: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        var predicate: NSPredicate? = nil
        var anchor: HKQueryAnchor? = nil

        if workoutActivityType.uintValue > 0 {
            guard let workoutType = HKWorkoutActivityType.init(rawValue: workoutActivityType.uintValue) else {
                return handleError(reject: reject, code: 1, description: "Invalid workoutActivityType.")
            }
            predicate = HKQuery.predicateForWorkouts(with: workoutType)
        }

        if lastAnchor.intValue != 0 {
            anchor = HKQueryAnchor(fromValue: lastAnchor.intValue)
        }

        let query: HKAnchoredObjectQuery = HKAnchoredObjectQuery.init(
            type: HKWorkoutType.workoutType(),
            predicate: predicate,
            anchor: anchor,
            limit: limit.intValue == 0 ? HKObjectQueryNoLimit : limit.intValue)
        { (query, samplesOrNil, deletedObjectsOrNil, newAnchor, errorOrNil) in
            if let error = errorOrNil {
                return self.handleError(reject: reject, code: 2, error: error)
            }

            var newRecords: [Dictionary<String, Any?>] = []
            var deletedRecords: [Dictionary<String, Any?>] = []

            guard let samples = samplesOrNil as? [HKWorkout] else {
                return self.handleError(reject: reject, description: "Error getting samples as HKWorkout")
            }

            for sample in samples {

                let workout: HKWorkout = sample

                let sourceDevice: String = sample.sourceRevision.productType ?? "unknown"

                let distance: Double? = workout.totalDistance?.doubleValue(for: .meter())
                let energyBurned: Double? = workout.totalEnergyBurned?.doubleValue(for: .kilocalorie())
                let isoStartDate = RNFitnessUtils.formatUtcIsoDateTimeString(workout.startDate)
                let isoEndDate = RNFitnessUtils.formatUtcIsoDateTimeString(workout.endDate)

                newRecords.append([
                    "uuid": workout.uuid.uuidString,
                    "duration": workout.duration,
                    "startDate": isoStartDate,
                    "endDate": isoEndDate,
                    "energyBurned": energyBurned,
                    "distance": distance,
                    "type": workout.workoutActivityType.rawValue,
                    "metadata": workout.metadata,
                    "source": [
                        "name": workout.sourceRevision.source.name,
                        "device": sourceDevice,
                        "id": workout.sourceRevision.source.bundleIdentifier,
                    ]
                ])
            }

            guard let deletedObjects = deletedObjectsOrNil else {
                return self.handleError(reject: reject, description: "Error getting deletedObjects for anchored querry")
            }

            for deletedSample in deletedObjects {
                deletedRecords.append([
                    "uuid": deletedSample.uuid.uuidString,
                    "metadata": deletedSample.metadata,
                ])
            }

            resolve([
                "anchor": newAnchor?.value(forKey: "rowid"),
                "deletedRecords": deletedRecords,
                "newRecords": newRecords
            ]);
        }

        healthStore.execute(query)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(query)
        }
    }

    @objc public func queryWorkouts(
        _ workoutActivityType: NSNumber,
        start: NSNumber,
        end: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let startDate = RNFitnessUtils.getDateFrom(timestamp: start.intValue)
        let endDate = RNFitnessUtils.getDateFrom(timestamp: end.intValue)

        var predicate: NSPredicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: HKQueryOptions.init(rawValue: 0))

        if workoutActivityType.uintValue > 0 {
            guard let workoutType = HKWorkoutActivityType.init(rawValue: workoutActivityType.uintValue) else {
                return handleError(reject: reject, code: 1, description: "Invalid workoutActivityType.")
            }
            let workoutTypePredicate = HKQuery.predicateForWorkouts(with: workoutType)
            predicate = NSCompoundPredicate.init(andPredicateWithSubpredicates: [predicate, workoutTypePredicate])
        }

        let sortDescriptor = NSSortDescriptor.init(key: HKSampleSortIdentifierStartDate, ascending: false)

        let query: HKSampleQuery = HKSampleQuery.init(
            sampleType: HKWorkoutType.workoutType(),
            predicate: predicate,
            limit: HKObjectQueryNoLimit,
            sortDescriptors: [sortDescriptor]
        ) { query, samples, error in

            if let error = error {
                return self.handleError(reject: reject, code: 2, error: error)
            }

            var dataRecords: [Dictionary<String, Any?>] = []

            guard let samples = samples as? [HKWorkout] else {
                return self.handleError(reject: reject, description: "Error getting samples as HKQuantitySample")
            }

            for sample in samples {

                let workout: HKWorkout = sample

                let sourceDevice: String = sample.sourceRevision.productType ?? "unknown"

                let distance: Double? = workout.totalDistance?.doubleValue(for: .meter())
                let energyBurned: Double? = workout.totalEnergyBurned?.doubleValue(for: .kilocalorie())
                let isoStartDate = RNFitnessUtils.formatUtcIsoDateTimeString(workout.startDate)
                let isoEndDate = RNFitnessUtils.formatUtcIsoDateTimeString(workout.endDate)

                dataRecords.append([
                    "uuid": workout.uuid.uuidString,
                    "duration": workout.duration,
                    "startDate": isoStartDate,
                    "endDate": isoEndDate,
                    "energyBurned": energyBurned,
                    "distance": distance,
                    "type": workout.workoutActivityType.rawValue,
                    "metadata": workout.metadata,
                    "source": [
                        "name": workout.sourceRevision.source.name,
                        "device": sourceDevice,
                        "id": workout.sourceRevision.source.bundleIdentifier,
                    ]
                ])
            }

            resolve(dataRecords);
        }

        healthStore.execute(query)

        DispatchQueue.main.asyncAfter(deadline: .now() + QUERY_TIMEOUT_IN_SECONDS) {
            self.healthStore.stop(query)
        }
    }

    @objc public func writeBloodPressure(
        _ systolicPressure: NSNumber,
        diastolicPressure: NSNumber,
        start: NSNumber,
        end: NSNumber,
        metadata: Dictionary<String, Any>,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let startDate = RNFitnessUtils.getDateFrom(timestamp: start.intValue)
        let endDate = RNFitnessUtils.getDateFrom(timestamp: end.intValue)
        let systolicQuantity: HKQuantity = HKQuantity.init(unit: HKUnit.millimeterOfMercury(), doubleValue: systolicPressure.doubleValue)
        let diastolicQuantity: HKQuantity = HKQuantity.init(unit: HKUnit.millimeterOfMercury(), doubleValue: diastolicPressure.doubleValue)

        guard
            let systolicType = HKObjectType.quantityType(forIdentifier: .bloodPressureSystolic),
            let diastolicType = HKObjectType.quantityType(forIdentifier: .bloodPressureDiastolic),
            let bloodPressureType = HKCorrelationType.correlationType(forIdentifier: .bloodPressure)
        else {
            return handleError(reject: reject, description: "Error getting quantity type.")
        }

        let systolicSample = HKQuantitySample.init(type: systolicType, quantity: systolicQuantity, start: startDate, end: endDate, metadata: metadata)
        let diastolicSample = HKQuantitySample.init(type: diastolicType, quantity: diastolicQuantity, start: startDate, end: endDate, metadata: metadata)

        let bloodPressureSet: Set<HKSample> = Set([systolicSample, diastolicSample])

        let bloodPressureSample = HKCorrelation.init(type: bloodPressureType, start: startDate, end: endDate, objects: bloodPressureSet, metadata: metadata)

        healthStore.save(bloodPressureSample) { success, error in
            if let error = error {
                self.handleError(reject: reject, error: error)
            } else {
                resolve(success)
            }
        }
    }

    @objc public func getAuthorizationStatusForType(
        _ dataTypeIdentifier: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let type = transformDataKeyToHKObject(dataTypeIdentifier) else {
            return handleError(reject: reject, code: 1, description: "Invalid dataTypeIdentifier.")
        }

        let status = healthStore.authorizationStatus(for: type)

        resolve(status.rawValue)
    }

    @objc public func deleteRecord(
        _ dataTypeIdentifier: String,
        uuid: String?,
        start: NSNumber,
        end: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        var predicate: NSPredicate = HKQuery.predicateForObjects(from: HKSource.default())

        if let uuid = uuid {
            if let uuid: UUID = UUID.init(uuidString: uuid) {
                let predicateUuid = HKQuery.predicateForObject(with: uuid)
                predicate = NSCompoundPredicate.init(andPredicateWithSubpredicates: [predicate, predicateUuid])
            } else {
                return handleError(reject: reject, code: 1, description: "Invalid uuid.")
            }
        } else {
            if start.intValue > 0 && end.intValue > 0 {
                let startDate = RNFitnessUtils.getDateFrom(timestamp: start.intValue)
                let endDate = RNFitnessUtils.getDateFrom(timestamp: end.intValue)
                let predicateForDate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: HKQueryOptions.init(rawValue: 0))
                predicate = NSCompoundPredicate.init(andPredicateWithSubpredicates: [predicate, predicateForDate])
            } else {
                return handleError(reject: reject, code: 1, description: "startDate and endDate must be defined more than 0. Or uuid must be provided.")
            }
        }

        guard let sampleType = transformDataKeyToHKSampleType(dataTypeIdentifier) else {
            return handleError(reject: reject, code: 1, description: "Invalid dataTypeIdentifier.")
        }

        let sortDescriptor = NSSortDescriptor.init(key: HKSampleSortIdentifierStartDate, ascending: true)

        let sampleQuery: HKSampleQuery = HKSampleQuery.init(
            sampleType: sampleType,
            predicate: predicate,
            limit: HKObjectQueryNoLimit,
            sortDescriptors: [sortDescriptor]
        ) { (query: HKSampleQuery, samples: [HKObject]?, error: Error?) in

            if let error = error {
                return self.handleError(reject: reject, error: error)
            }

            guard let samples = samples else {
                return self.handleError(reject: reject, description: "Error getting samples as HKQuantitySample")
            }

            if samples.count == 0 {
                resolve(0)
                return
            }

            var count = samples.count
            var deletedSamples = 0

            for sample in samples {
                self.healthStore.delete(sample) { success, error in
                    count -= 1

                    if let error = error {
                        print(error.localizedDescription)
                        //                        return reject(self.standardErrorCode(0), error.localizedDescription, error)
                    } else {
                        deletedSamples += 1
                    }

                    if count < 1 {
                        resolve(deletedSamples)
                    }
                }
            }
        }

        healthStore.execute(sampleQuery)
    }

    @objc public func isHealthDataAvailable(
        _ resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        resolve(HKHealthStore.isHealthDataAvailable())
    }

}
