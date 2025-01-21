//
//  TimerWidgetBundle.swift
//  TimerWidget
//
//  Created by Sergio Belena on 21/1/25.
//

import WidgetKit
import SwiftUI

@main
struct TimerWidgetBundle: WidgetBundle {
    var body: some Widget {
        TimerWidget()
        TimerWidgetLiveActivity()
    }
}
