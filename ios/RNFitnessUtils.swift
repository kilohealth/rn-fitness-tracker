//
//  RNFitnessUtils.swift
//  RNFitnessTracker
//
//  Created by Matas on 2022-02-10.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

@objc(RNFitnessUtils)
class RNFitnessUtils: NSObject {

    private static func setHoursMinutesSeconds(date: Date, hours: NSInteger, minutes: NSInteger, seconds: NSInteger) -> Date {
        return NSCalendar.current.date(bySettingHour: hours, minute: minutes, second: seconds, of: date)!;
    }

    static func startOfDay(date: Date) -> Date {
        return self.setHoursMinutesSeconds(date: date, hours: 0, minutes: 0, seconds: 0);
    }

    static func endOfDay(date: Date) -> Date {
        return self.setHoursMinutesSeconds(date: date, hours: 23, minutes: 59, seconds: 59);
    }

    static func daysAgo(date: Date, _ numberOfDays: Int) -> Date? {
        return date.addingTimeInterval(TimeInterval(-numberOfDays*86400));
    }

    static func beginningOfDay(date: Date) -> Date {
        self.setHoursMinutesSeconds(date: date, hours: 0, minutes: 0, seconds: 0)
    }

    static func startOfXDaysAgo(date: Date, numberOfDays: Int) -> Date {
        let day: Date? = self.daysAgo(date: date, numberOfDays)

        return self.setHoursMinutesSeconds(date: day!, hours: 0, minutes: 0, seconds: 0)
    }

    static func formatIsoDateString(_ date: Date) -> String {
        let formatter: ISO8601DateFormatter = ISO8601DateFormatter.init()
        formatter.formatOptions = .withFullDate
        formatter.timeZone = TimeZone.current

        return formatter.string(from: date)
    }

    static func getDateFrom(timestamp: Int) -> Date {
        Date(timeIntervalSince1970: TimeInterval(timestamp / 1000))
    }

    static func formatUtcIsoDateTimeString(_ date: Date) -> String {
        let formatter: ISO8601DateFormatter = ISO8601DateFormatter.init()
        formatter.formatOptions = [.withFullDate, .withFullTime]
        formatter.timeZone = TimeZone.init(secondsFromGMT: 0)

        return formatter.string(from: date)
    }
}

extension Double {
    func rounded(toPlaces places: Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return (self * divisor).rounded() / divisor
    }
}
