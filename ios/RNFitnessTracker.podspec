#
#  Be sure to run `pod spec lint RNFitnessTracker.podspec' to ensure this is a
#  valid spec and to remove all comments including this before submitting the spec.
#
#  To learn more about Podspec attributes see https://guides.cocoapods.org/syntax/podspec.html
#  To see working Podspecs in the CocoaPods repo see https://github.com/CocoaPods/Specs/
#

Pod::Spec.new do |s|

  s.name           = "RNFitnessTracker"
  s.version        = "0.0.1"
  s.summary        = "Fitness tracker package"
  s.description    = "Fitness tracker package"
  s.author         = "Kilo.Health"
  s.homepage       = "kilo.health"
  s.license = { :type => 'MIT', :text => <<-LICENSE
                     MIT License
                     Copyright © 2019 Dovile Maminskaite
                     Permission is hereby granted, free of charge, to any person obtaining a copy
                     of this software and associated documentation files (the "Software"), to deal
                     in the Software without restriction, including without limitation the rights
                     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                     copies of the Software, and to permit persons to whom the Software is
                     furnished to do so, subject to the following conditions:
                     The above copyright notice and this permission notice shall be included in all
                     copies or substantial portions of the Software.
                     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                     SOFTWARE.
                     LICENSE
                   }


  s.platform = :ios, "8.0"

  s.source = { :git => "https://github.com/Dovke/rn-fitness-tracker.git", :tag => s.version }

  s.preserve_paths = 'LICENSE', 'README.md', 'package.json', 'index.js'
  s.source_files  = "ios/*.{h,m}"

  s.dependency 'React'
  s.dependency 'React-Core'
  s.dependency 'React-DevSupport'
  s.dependency 'React-RCTActionSheet'
  s.dependency 'React-RCTBlob'
  s.dependency 'React-RCTImage'
  s.dependency 'React-RCTLinking'
  s.dependency 'React-RCTNetwork'
  s.dependency 'React-RCTSettings'
  s.dependency 'React-RCTText'
  s.dependency 'React-RCTVibration'
  s.dependency 'React-RCTWebSocket'

  s.dependency 'React-cxxreact'
  s.dependency 'React-jsi'
  s.dependency 'React-jsiexecutor'
  s.dependency 'React-jsinspector'
  s.dependency 'yoga'

  s.dependency 'DoubleConversion'
  s.dependency 'glog'
  s.dependency 'Folly'

end
