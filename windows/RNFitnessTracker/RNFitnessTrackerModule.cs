using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Fitness.Tracker.RNFitnessTracker
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNFitnessTrackerModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNFitnessTrackerModule"/>.
        /// </summary>
        internal RNFitnessTrackerModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNFitnessTracker";
            }
        }
    }
}
