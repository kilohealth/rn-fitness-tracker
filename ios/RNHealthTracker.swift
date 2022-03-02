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
    private var healthStore: HKHealthStore

    override init() {
        healthStore = HKHealthStore()
        super.init()
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    private func formatHKQuantityTypeIdentifier(_ dataKey: String) -> String {
        "HKQuantityTypeIdentifier\(dataKey)"
    }

    private func transformDataKeyToHKQuantityType(dataKey: String) -> HKQuantityType? {
        HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: formatHKQuantityTypeIdentifier(dataKey)))
    }

    private func transformDataKeyToHKSampleType(dataKey: String) -> HKSampleType? {
        HKSampleType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: formatHKQuantityTypeIdentifier(dataKey)))
    }

    private func transformDataKeyToHKObject(dataKey: String) -> HKObjectType {
        if dataKey == "Workout" {
            return HKObjectType.workoutType()
        } else {
            return HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: dataKey))!
        }
    }

    private func standardErrorCode(_ code: Int?) -> String? {
        let descriptions = [
            "E_UNKNOWN",
            "E_DEVELOPER_ERROR",
            "E_EXECUTING_QUERY"
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

        guard let sampleType = transformDataKeyToHKSampleType(dataKey: dataTypeIdentifier) else {
            return reject(standardErrorCode(1), "Invalid dataTypeIdentifier.", nil)
        }
        let predicate: NSPredicate = HKQuery.predicateForSamples(withStart: start, end: end, options: HKQueryOptions(rawValue: 0))
        let sortDescriptor: NSSortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let sampleQuery: HKSampleQuery = HKSampleQuery.init(sampleType: sampleType, predicate: predicate, limit: 1, sortDescriptors: [sortDescriptor]) { (query: HKSampleQuery, results: [HKSample]?, error: Error?) in
            if error != nil {
                reject(self.standardErrorCode(2), error?.localizedDescription, error)
                return
            }
            
            if results != nil {
                var quantitySum = 0.0;

                guard let samples = results as? [HKQuantitySample] else {
                    reject(self.standardErrorCode(0), "Error getting results as HKQuantitySample", nil)
                    return
                }


                for sample in samples {
                    let value: Double = sample.quantity.doubleValue(for: HKUnit.init(from: unit))
                    quantitySum += value
                }

                if quantitySum > 0 {
                    resolve(2)
                } else {
                    resolve(1)
                }
            } else {
                resolve(0)
            }
        }

        healthStore.execute(sampleQuery)
    }

}
