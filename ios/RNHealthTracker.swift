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

    private func transformDataKeyToHKQuantityType(_ dataKey: String) -> HKQuantityType? {
        HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: formatHKQuantityTypeIdentifier(dataKey)))
    }

    private func transformDataKeyToHKSampleType(_ dataKey: String) -> HKSampleType? {
        HKSampleType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: formatHKQuantityTypeIdentifier(dataKey)))
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
            "E_DEVICE_NOT_SUPPORTED"
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
        
        var read: Set<HKObjectType>? = nil
        var toShare: Set<HKSampleType>? = nil
        
        if !readTypes.isEmpty {
            read = Set()
            
            for dataType in readTypes {
                guard let object: HKObjectType = transformDataKeyToHKObject(dataType) else {
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

}
