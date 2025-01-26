//
//  TimerWidgetModule.swift
//  healthhabitzapp
//
//  Created by Sergio Belena on 21/1/25.
//

import Foundation
import ActivityKit

@available(iOS 16.2, *)
@objc(TimerWidgetModule)
class TimerWidgetModule: NSObject {
  private var currentActivity: Activity<TimerWidgetAttributes>?
  private var startedAt: Date?
  
  private func areActivitiesEnabled() -> Bool {
    return ActivityAuthorizationInfo().areActivitiesEnabled
  }

  @objc
  func startLiveActivity(_ timestamp: Double) -> Void {
    startedAt = Date(timeIntervalSince1970: timestamp)
    if (!areActivitiesEnabled()) {
      // User disabled Live Activities for the app, nothing to do
      return
    }
      // Preparing data for the Live Activity
      let activityAttributes = TimerWidgetAttributes()
      let contentState = TimerWidgetAttributes.ContentState(startedAt: startedAt)
      let activityContent = ActivityContent(state: contentState,  staleDate: nil)
      do {
        // Request to start a new Live Activity with the content defined above
        currentActivity = try Activity.request(attributes: activityAttributes, content: activityContent)
      } catch {
        // Handle errors, skipped for simplicity
      }
    
  }
  
  @objc
  func reset() -> Void {
    let contentState = TimerWidgetAttributes.ContentState(startedAt: Date())
      Task {
        await currentActivity?.update(
          ActivityContent<TimerWidgetAttributes.ContentState>(
            state: contentState,
            staleDate: nil
          )
        )
      }
  }

  @objc
  func stopLiveActivity() -> Void {
    // It helps to avoid blocking the main thread
      startedAt = nil
      currentActivity = nil
      Task {
        for activity in Activity<TimerWidgetAttributes>.activities {
          await activity.end(nil, dismissalPolicy: .immediate)
        }
      }
  }
}
