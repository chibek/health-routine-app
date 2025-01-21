//
//  TimerWidgetModule.swift
//  healthhabitzapp
//
//  Created by Sergio Belena on 21/1/25.
//

import Foundation
import ActivityKit

@objc(TimerWidgetModule)
class TimerWidgetModule: NSObject {

  private func areActivitiesEnabled() -> Bool {
    if #available(iOS 16.1, *) {
      return ActivityAuthorizationInfo().areActivitiesEnabled
    } else {
      return false
    }
  }

  @objc
  func startLiveActivity() -> Void {
    print("Starting Live Activity")
    
    if (!areActivitiesEnabled()) {
      print("Entra 1")
      // User disabled Live Activities for the app, nothing to do
      return
    }
    if #available(iOS 16.2, *) {
      print("Entra 2")
      // Preparing data for the Live Activity
      let activityAttributes = TimerWidgetAttributes()
      let contentState = TimerWidgetAttributes.ContentState(startedAt: Date())
      let activityContent = ActivityContent(state: contentState,  staleDate: nil)
      do {
        // Request to start a new Live Activity with the content defined above
        try Activity.request(attributes: activityAttributes, content: activityContent)
      } catch {
        // Handle errors, skipped for simplicity
      }
    }
  }

  @objc
  func stopLiveActivity() -> Void {
    // A task is a unit of work that can run concurrently in a lightweight thread, managed by the Swift runtime
    // It helps to avoid blocking the main thread
    if #available(iOS 16.2, *) {
      Task {
        for activity in Activity<TimerWidgetAttributes>.activities {
          await activity.end(nil, dismissalPolicy: .immediate)
        }
      }
    }
  }
}
