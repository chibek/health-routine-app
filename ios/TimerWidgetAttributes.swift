//
//  TimerAttributes.swift
//  healthhabitzapp
//
//  Created by Sergio Belena on 21/1/25.
//

import Foundation
import ActivityKit


struct TimerWidgetAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var startedAt: Date?

    // This will be useful later on to calculate the bridge time (since the timer will be started from JS land)
    func getTimeIntervalSinceNow() -> Double {
      guard let startedAt = self.startedAt else {
        return 0
      }
      return startedAt.timeIntervalSince1970 - Date().timeIntervalSince1970
    }
  }
}
