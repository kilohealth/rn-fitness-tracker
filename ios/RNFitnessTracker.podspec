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
  s.license = { :type => 'Apache License, Version 2.0', :text => <<-LICENSE
                     Licensed under the Apache License, Version 2.0 (the "License");
                     you may not use this file except in compliance with the License.
                     You may obtain a copy of the License at

                     http://www.apache.org/licenses/LICENSE-2.0

                     Unless required by applicable law or agreed to in writing, software
                     distributed under the License is distributed on an "AS IS" BASIS,
                     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                     See the License for the specific language governing permissions and
                     limitations under the License.
                     LICENSE
                   }


  s.platform = :ios, "8.0"

  s.source = { :git => "git clone git@bitbucket.org:dov_ile/rn-fitness-tracker.git", :tag => s.version }

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
