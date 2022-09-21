package com.fitnesstracker.googlefit

import java.text.SimpleDateFormat
import java.util.*

class DateHelper {
    companion object {
        private const val DATE_FORMAT = "yyyy-MM-dd"
        private val dateFormat = SimpleDateFormat(DATE_FORMAT, Locale.ENGLISH)

        private fun setMidnight(date: Date): Calendar {
            val calendar = Calendar.getInstance()
            calendar.time = date
            val year = calendar[Calendar.YEAR]
            val month = calendar[Calendar.MONTH]
            val day = calendar[Calendar.DATE]
            calendar[year, month, day, 0, 0] = 0
            calendar[Calendar.MILLISECOND] = 0
            return calendar
        }

        fun isToday(date: Date): Boolean {
            return formatDate(date) == formatDate(Date())
        }

        fun getStartOfDay(date: Date): Date {
            val calendar = setMidnight(date)
            return calendar.time
        }

        fun getEndOfDay(date: Date): Date {
            val calendar = setMidnight(date)
            calendar.add(Calendar.DATE, 1)
            return calendar.time
        }

        fun addDays(date: Date, daysDifference: Int): Date {
            val cal = Calendar.getInstance()
            cal.time = date
            cal.add(Calendar.DATE, daysDifference)
            return cal.time
        }

        fun formatDate(date: Date): String {
            return dateFormat.format(date)
        }
    }
}