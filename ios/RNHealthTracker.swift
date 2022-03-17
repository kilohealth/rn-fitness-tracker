//
//  RNHealthTracker.swift
//  RNFitnessTracker
//
//  Created by Matas on 2022-02-10.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import HealthKit

@objc(RNHealthTracker)
class RNHealthTracker: NSObject {
    private let healthStore: HKHealthStore = HKHealthStore()

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
            "E_DATABASE_INACCESSIBLE"
        ]
        guard let code = code else {
            return descriptions[0]
        }

        if code > descriptions.count - 1 {
            return descriptions[0]
        }
        return descriptions[code]
    }

    @objc public func getReadStatus(_ dataTypeIdentifier: String, unit: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let currentDate = Date()
        let start: Date? = RNFitnessUtilsTestttttttttt.daysAgo(date: currentDate, 720)
        let end: Date? = RNFitnessUtilsTestttttttttt.endOfDay(date: currentDate)

        guard let sampleType = transformDataKeyToHKSampleType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }
        let predicate: NSPredicate = HKQuery.predicateForSamples(withStart: start, end: end, options: HKQueryOptions(rawValue: 0))
        let sortDescriptor: NSSortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let sampleQuery: HKSampleQuery = HKSampleQuery.init(sampleType: sampleType, predicate: predicate, limit: 1, sortDescriptors: [sortDescriptor]) { (query: HKSampleQuery, samples: [HKSample]?, error: Error?) in
            
            if let error = error {
                if error.localizedDescription == "Authorization not determined" {
                    resolve(0)
                } else {
                    reject(self.standardErrorCode(2), error.localizedDescription, error)
                }
                
                return
            }
            
            guard let samples = samples as? [HKQuantitySample] else {
                reject(self.standardErrorCode(0), "Error getting samples as HKQuantitySample", nil)
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

        healthStore.execute(sampleQuery)
    }
    
    @objc public func authorize(_ shareTypes: [String], readTypes: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if !HKHealthStore.isHealthDataAvailable() {
            reject(self.standardErrorCode(3), "Health data is not supported on this device.", nil)
            return
        }
        
        var read: Set<HKSampleType>? = nil
        var toShare: Set<HKSampleType>? = nil
        
        if !readTypes.isEmpty {
            read = Set()
            
            for dataType in readTypes {
                guard let object: HKSampleType = transformDataKeyToHKSampleType(dataType) else {
                    reject(standardErrorCode(1), "Invalid read dataTypes.", nil)
                    return
                }
                read!.insert(object)
            }
        }
        
        if !shareTypes.isEmpty {
            toShare = Set()
            
            for dataType in shareTypes {
                guard let object: HKSampleType = transformDataKeyToHKSampleType(dataType) else {
                    reject(standardErrorCode(1), "Invalid share dataTypes.", nil)
                    return
                }
                toShare!.insert(object)
            }
        }
        
        healthStore.requestAuthorization(toShare: toShare, read: read) { success, error in
            if let error = error {
                reject(self.standardErrorCode(nil), error.localizedDescription, error)
            } else {
                resolve(true)
            }
        }
    }
    
    @objc public func getStatisticTotalForToday(_ dataTypeIdentifier: String, unit: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let currentDate = Date()
        let start: Date = RNFitnessUtilsTestttttttttt.startOfDay(date: currentDate)
        let end: Date = RNFitnessUtilsTestttttttttt.endOfDay(date: start)
        var interval: DateComponents = DateComponents()
        interval.day = 1
        
        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }
        
        // Create the query.
        let query = HKStatisticsCollectionQuery(quantityType: quantityType,
                                                quantitySamplePredicate: nil,
                                                options: .cumulativeSum,
                                                anchorDate: start,
                                                intervalComponents: interval)
        
        // Set the results handler.
        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in
            
            // Handle errors here.
            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    // HealthKit couldn't access the database because the device is locked.
                    reject(self.standardErrorCode(4), error.localizedDescription, error)
                    return
                default:
                    // Handle other HealthKit errors here.
                    reject(self.standardErrorCode(nil), error.localizedDescription, error)
                    return
                }
            }
            
            guard let statsCollection = results else {
                // You should only hit this case if you have an unhandled error. Check for bugs
                // in your code that creates the query, or explicitly handle the error.
                reject(self.standardErrorCode(nil), "unhandled error getting results.", error)
                return
            }
            
            statsCollection.enumerateStatistics(from: start, to: end) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                guard let quantity: HKQuantity = result.sumQuantity() else {
                    reject(self.standardErrorCode(nil), "cumulativeSum option was not set.", error)
                    return
                }
                
                let value: Double = quantity.doubleValue(for: HKUnit.init(from: unit))
                resolve("\(value)")
            }
        }
        
        healthStore.execute(query)
    }
    
    @objc public func getStatisticTotalForWeek(_ dataTypeIdentifier: String, unit: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let currentDate = Date()
        let end: Date = RNFitnessUtilsTestttttttttt.endOfDay(date: currentDate)
        let start: Date = RNFitnessUtilsTestttttttttt.startOfXDaysAgo(date: end, numberOfDays: 6)
        var interval: DateComponents = DateComponents()
        interval.day = 1
        
        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }
        
        // Create the query.
        let query = HKStatisticsCollectionQuery(quantityType: quantityType,
                                                quantitySamplePredicate: nil,
                                                options: .cumulativeSum,
                                                anchorDate: start,
                                                intervalComponents: interval)
        
        // Set the results handler.
        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in
            
            // Handle errors here.
            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    // HealthKit couldn't access the database because the device is locked.
                    reject(self.standardErrorCode(4), error.localizedDescription, error)
                    return
                default:
                    // Handle other HealthKit errors here.
                    reject(self.standardErrorCode(nil), error.localizedDescription, error)
                    return
                }
            }
            
            guard let statsCollection = results else {
                // You should only hit this case if you have an unhandled error. Check for bugs
                // in your code that creates the query, or explicitly handle the error.
                reject(self.standardErrorCode(nil), "unhandled error getting results.", error)
                return
            }
            
            var total: Double = 0;
            
            statsCollection.enumerateStatistics(from: start, to: end) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                guard let quantity: HKQuantity = result.sumQuantity() else {
                    reject(self.standardErrorCode(nil), "cumulativeSum option was not set.", error)
                    return
                }
                
                let value: Double = quantity.doubleValue(for: HKUnit.init(from: unit))
                total += value;
            }
            
            if unit == HKUnit.count().unitString {
                resolve("\(Int(total))")
            } else {
                resolve("\(total)")
            }
        }
        
        healthStore.execute(query)
    }

    @objc public func queryTotal(_ dataTypeIdentifier: String, unit: String, start: NSNumber, end: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        let startDate = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: start.intValue)
        let endDate = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: end.intValue)
        var interval: DateComponents = DateComponents()
        interval.day = 1

        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }

        // Create the query.
        let query = HKStatisticsCollectionQuery(quantityType: quantityType,
                                                quantitySamplePredicate: nil,
                                                options: .cumulativeSum,
                                                anchorDate: startDate,
                                                intervalComponents: interval)

        // Set the results handler.
        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in

            // Handle errors here.
            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    // HealthKit couldn't access the database because the device is locked.
                    reject(self.standardErrorCode(4), error.localizedDescription, error)
                    return
                default:
                    // Handle other HealthKit errors here.
                    reject(self.standardErrorCode(nil), error.localizedDescription, error)
                    return
                }
            }

            guard let statsCollection = results else {
                // You should only hit this case if you have an unhandled error. Check for bugs
                // in your code that creates the query, or explicitly handle the error.
                reject(self.standardErrorCode(nil), "unhandled error getting results.", error)
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
                resolve("\(Int(total))")
            } else {
                resolve("\(total)")
            }
        }

        healthStore.execute(query)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
            self.healthStore.stop(query)
        }
    }
    
    @objc public func getStatisticWeekDaily(_ dataTypeIdentifier: String, unit: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let currentDate = Date()
        let end = RNFitnessUtilsTestttttttttt.endOfDay(date: currentDate)
        let start = RNFitnessUtilsTestttttttttt.startOfXDaysAgo(date: end, numberOfDays: 6)
        var interval: DateComponents = DateComponents()
        interval.day = 1
        
        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }
        
        // Create the query.
        let query = HKStatisticsCollectionQuery(quantityType: quantityType,
                                                quantitySamplePredicate: nil,
                                                options: .cumulativeSum,
                                                anchorDate: start,
                                                intervalComponents: interval)
        
        // Set the results handler.
        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in
            
            // Handle errors here.
            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    // HealthKit couldn't access the database because the device is locked.
                    reject(self.standardErrorCode(4), error.localizedDescription, error)
                    return
                default:
                    // Handle other HealthKit errors here.
                    reject(self.standardErrorCode(nil), error.localizedDescription, error)
                    return
                }
            }
            
            
            
            guard let statsCollection = results else {
                // You should only hit this case if you have an unhandled error. Check for bugs
                // in your code that creates the query, or explicitly handle the error.
                reject(self.standardErrorCode(nil), "unhandled error getting results.", error)
                return
            }
            
            var data: [String: Any] = [:]
            
            statsCollection.enumerateStatistics(from: start, to: end) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                if let quantity: HKQuantity = result.sumQuantity() {
                    let dateString = RNFitnessUtilsTestttttttttt.formatIsoDateString(result.startDate)
                    
                    var value: Any = quantity.doubleValue(for: HKUnit.init(from: unit))
                    
                    if unit == HKUnit.count().unitString {
                        value = Int(value as! Double);
                    }
                    
                    data[dateString] = value;
                }
            }
            
            resolve(data);
        }
        
        healthStore.execute(query)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
            self.healthStore.stop(query)
        }
    }
    
    @objc public func queryDailyTotals(_ dataTypeIdentifier: String, unit: String, start: NSNumber, end: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        let startDate: Date = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: start.intValue)
        let endDate: Date = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: end.intValue)
        var interval: DateComponents = DateComponents()
        interval.day = 1

        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }

        // Create the query.
        let query = HKStatisticsCollectionQuery(quantityType: quantityType,
                                                quantitySamplePredicate: nil,
                                                options: .cumulativeSum,
                                                anchorDate: startDate,
                                                intervalComponents: interval)

        // Set the results handler.
        query.initialResultsHandler = { (query: HKStatisticsCollectionQuery, results: HKStatisticsCollection?, error: Error?) in

            // Handle errors here.
            if let error = error as? HKError {
                switch (error.code) {
                case .errorDatabaseInaccessible:
                    // HealthKit couldn't access the database because the device is locked.
                    reject(self.standardErrorCode(4), error.localizedDescription, error)
                    return
                default:
                    // Handle other HealthKit errors here.
                    reject(self.standardErrorCode(nil), error.localizedDescription, error)
                    return
                }
            }

            guard let statsCollection = results else {
                // You should only hit this case if you have an unhandled error. Check for bugs
                // in your code that creates the query, or explicitly handle the error.
                reject(self.standardErrorCode(nil), "unhandled error getting results.", error)
                return
            }
            
            var data: [String: Any] = [:]
            
            statsCollection.enumerateStatistics(from: startDate, to: endDate) { (result: HKStatistics, stop: UnsafeMutablePointer<ObjCBool>) in
                if let quantity: HKQuantity = result.sumQuantity() {
                    let dateString = RNFitnessUtilsTestttttttttt.formatIsoDateString(result.startDate)
                    
                    var value: Any = quantity.doubleValue(for: HKUnit.init(from: unit))
                    
                    if unit == HKUnit.count().unitString {
                        value = Int(value as! Double);
                    }
                    
                    data[dateString] = value;
                }
            }
        
            resolve(data);
        }

        healthStore.execute(query)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
            self.healthStore.stop(query)
        }
    }
    
    @objc public func writeData(_ dataTypeIdentifier: String, unit: String, quantity: NSNumber, metadata: Dictionary<String, Any>, timestamp: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }
        
        let quantity: HKQuantity = HKQuantity.init(unit: HKUnit.init(from: unit), doubleValue: quantity.doubleValue)
        var date: Date = Date()
        if timestamp.intValue != 0 {
            date = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: timestamp.intValue)
        }
        
        let dataObject: HKQuantitySample = HKQuantitySample.init(type: quantityType, quantity: quantity, start: date, end: date, metadata: metadata)
        
        healthStore.save(dataObject) { success, error in
            if let error = error {
                reject(self.standardErrorCode(nil), error.localizedDescription, error)
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
                    return reject(standardErrorCode(1), "Wrong data passed to RNHealthTracker:writeDataArray", nil)
                }
                
                guard let dataTypeIdentifier: String = (obj["key"] as? String),
                      let unit: String = (obj["unit"] as? String),
                      let amount: NSNumber = (obj["quantity"] as? NSNumber),
                      let timestamp: NSNumber = (obj["timestamp"] as? NSNumber),
                      let metadata: Dictionary<String, Any> = (obj["metadata"] as? Dictionary<String, Any>)
                else {
                    return reject(standardErrorCode(1), "Wrong data passed to RNHealthTracker:writeDataArray, dataArray id \(index)", nil)
                }
                
                var date: Date = Date()
                if timestamp.intValue != -1 {
                    date = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: timestamp.intValue)
                }
                
                guard let quantityType = transformDataKeyToHKQuantityType(dataTypeIdentifier) else {
                    return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
                }
                
                let quantity: HKQuantity = HKQuantity.init(unit: HKUnit.init(from: unit), doubleValue: amount.doubleValue)
                
                let dataObject: HKQuantitySample = HKQuantitySample.init(type: quantityType, quantity: quantity, start: date, end: date, metadata: metadata)
                
                dataArrayTransformed.append(dataObject)
            }
            
            healthStore.save(dataArrayTransformed)  { success, error in
                if let error = error {
                    reject(self.standardErrorCode(nil), error.localizedDescription, error)
                } else {
                    resolve(success)
                }
            }
        } else {
            return reject(standardErrorCode(1), "Empty array was passed.", nil)
        }
    }
    
    struct DataRecord {
        let uuid: String
        let date: String
        let quantity: Double
        let metadata: Dictionary<String, Any>?
        let source: Dictionary<String, String?>
    }
    
    @objc public func queryDataRecordsForNumberOfDays(
        _ dataTypeIdentifier: String,
        unit: String,
        numberOfDays: NSNumber,
        limit: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let currentDate = Date()
        let start: Date = RNFitnessUtilsTestttttttttt.startOfXDaysAgo(date: currentDate, numberOfDays: numberOfDays.intValue)
        let end: Date = RNFitnessUtilsTestttttttttt.endOfDay(date: currentDate)
            
        guard let sampleType = transformDataKeyToHKSampleType(dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }
        let predicate: NSPredicate = HKQuery.predicateForSamples(withStart: start, end: end, options: HKQueryOptions(rawValue: 0))
        let sortDescriptor: NSSortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let limit = limit.intValue == 0 ? HKObjectQueryNoLimit : limit.intValue
        let sampleQuery: HKSampleQuery = HKSampleQuery.init(sampleType: sampleType, predicate: predicate, limit: limit, sortDescriptors: [sortDescriptor]) { (query: HKSampleQuery, samples: [HKSample]?, error: Error?) in
            
            if let error = error {
                return reject(self.standardErrorCode(2), error.localizedDescription, error)
            }
            
            var dataRecords: [Dictionary<String, Any?>] = []
            
            guard let samples = samples as? [HKQuantitySample] else {
                reject(self.standardErrorCode(0), "Error getting samples as HKQuantitySample", nil)
                return
            }
            
            for sample in samples {
                let isoDate = RNFitnessUtilsTestttttttttt.formatIsoDateString(sample.endDate)
                
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

        healthStore.execute(sampleQuery)
    }
    
    @objc public func recordWorkout(
        _ workoutWithActivityType: NSNumber,
        start: NSNumber,
        end: NSNumber,
        energyBurned: NSNumber,
        distance: NSNumber,
        metadata: Dictionary<String, Any>,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let startDate: Date = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: start.intValue)
        let endDate: Date = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: end.intValue)
        let totalEnergyBurned: HKQuantity = HKQuantity.init(unit: .kilocalorie(), doubleValue: energyBurned.doubleValue)

        let totalDistance: HKQuantity = HKQuantity.init(unit: .meter(), doubleValue: distance.doubleValue)
        guard let activityType = HKWorkoutActivityType.init(rawValue: workoutWithActivityType.uintValue) else {
            return reject(standardErrorCode(1), "Invalid workoutWithActivityType.", nil)
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
                reject(self.standardErrorCode(nil), error.localizedDescription, error)
            } else {
                resolve(success)
            }
        }
    }
    
    @objc public func queryWorkouts(
        _ workoutActivityType: NSNumber,
        start: NSNumber,
        end: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let startDate = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: start.intValue)
        let endDate = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: end.intValue)
        
        var predicate: NSPredicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: HKQueryOptions.init(rawValue: 0))
        
        if workoutActivityType.uintValue > 0 {
            guard let workoutType = HKWorkoutActivityType.init(rawValue: workoutActivityType.uintValue) else {
                return reject(standardErrorCode(1), "Invalid workoutActivityType.", nil)
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
                return reject(self.standardErrorCode(2), error.localizedDescription, error)
            }

            var dataRecords: [Dictionary<String, Any?>] = []

            guard let samples = samples as? [HKWorkout] else {
                reject(self.standardErrorCode(0), "Error getting samples as HKQuantitySample", nil)
                return
            }

            for sample in samples {

                let workout: HKWorkout = sample

                let sourceDevice: String = sample.sourceRevision.productType ?? "unknown"

                let distance: Double? = workout.totalDistance?.doubleValue(for: .meter())
                let energyBurned: Double? = workout.totalEnergyBurned?.doubleValue(for: .kilocalorie())
                let isoStartDate = RNFitnessUtilsTestttttttttt.formatIsoDateString(workout.startDate)
                let isoEndDate = RNFitnessUtilsTestttttttttt.formatIsoDateString(workout.endDate)

                dataRecords.append([
                    "uuid": workout.uuid.uuidString,
                    "duration": workout.duration,
                    "startDate": isoStartDate,
                    "endDate": isoEndDate,
                    "energyBurned": energyBurned,
                    "distance": distance,
                    "type": workout.workoutActivityType,
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

        DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
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
        let startDate = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: start.intValue)
        let endDate = RNFitnessUtilsTestttttttttt.getDateFrom(timestamp: end.intValue)
        let systolicQuantity: HKQuantity = HKQuantity.init(unit: HKUnit.millimeterOfMercury(), doubleValue: systolicPressure.doubleValue)
        let diastolicQuantity: HKQuantity = HKQuantity.init(unit: HKUnit.millimeterOfMercury(), doubleValue: diastolicPressure.doubleValue)

        guard
            let systolicType = HKObjectType.quantityType(forIdentifier: .bloodPressureSystolic),
            let diastolicType = HKObjectType.quantityType(forIdentifier: .bloodPressureDiastolic),
            let bloodPressureType = HKCorrelationType.correlationType(forIdentifier: .bloodPressure)
        else {
            return reject(standardErrorCode(0), "Error getting quantity type.", nil)
        }
        
        let systolicSample = HKQuantitySample.init(type: systolicType, quantity: systolicQuantity, start: startDate, end: endDate)
        let diastolicSample = HKQuantitySample.init(type: diastolicType, quantity: diastolicQuantity, start: startDate, end: endDate)
        
        let bloodPressureSet: Set<HKSample> = Set([systolicSample, diastolicSample])
        
        let bloodPressureSample = HKCorrelation.init(type: bloodPressureType, start: startDate, end: endDate, objects: bloodPressureSet, metadata: metadata)
        
        healthStore.save(bloodPressureSample) { success, error in
            if let error = error {
                reject(self.standardErrorCode(nil), error.localizedDescription, error)
            } else {
                resolve(success)
            }
        }
    }
    
}
