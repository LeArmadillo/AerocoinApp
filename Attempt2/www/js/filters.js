// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('nfcFilters', ['starter.controllers'])

    .filter('bytesToHexString', function() {
        return function (input) {
            if (window.nfc) {
                return nfc.bytesToHexString(input);
            } else {
                return input;
            }
        }
    })

    .filter('num', function() {
        return function(input) {
            return parseInt(input, 10);
        }
    })

    .filter('bytesToString', function() {
        return function(input) {
            if (window.nfc) {
                return nfc.bytesToString(input);
            } else {
                return input;
            }
        };
    })

    .filter('tnfToString', function() {

        function tnfToString(tnf) {
            var value = tnf;

            switch (tnf) {
                case ndef.TNF_EMPTY:
                    value = "Empty";
                    break;
                case ndef.TNF_WELL_KNOWN:
                    value = "Well Known";
                    break;
                case ndef.TNF_MIME_MEDIA:
                    value = "Mime Media";
                    break;
                case ndef.TNF_ABSOLUTE_URI:
                    value = "Absolute URI";
                    break;
                case ndef.TNF_EXTERNAL_TYPE:
                    value = "External";
                    break;
                case ndef.TNF_UNKNOWN:
                    value = "Unknown";
                    break;
                case ndef.TNF_UNCHANGED:
                    value = "Unchanged";
                    break;
                case ndef.TNF_RESERVED:
                    value = "Reserved";
                    break;
            }
            return value;
        }

        return function(input) {

            if (window.ndef) {
                return tnfToString(input);
            } else {
                return input;
            }

        };
    })

    .filter('decodePayload', function(balanceTracker) {

        function decodePayload(record) {
            var result = '0';
            var isReady = false;
            var payload,
                recordType = nfc.bytesToString(record.type);

            if (recordType === "T") {
                payload = ndef.textHelper.decodePayload(record.payload);
                result = payload;
            
            } else if (recordType === "U") {
                payload = ndef.uriHelper.decodePayload(record.payload);
                result = payload;
            } else {

                // we don't know how to translate this type, try and print it out.
                // your app should know how to process tags it receives

                var printableData = record.payload.map(function(i) {
                    if (i <= 0x1F) {
                        return '.'; // unprintable, replace with "."
                    } else {
                        return i;
                    }
                });
            result = nfc.bytesToString(record);
            
            }
            if(isFinite(result))
            {
                if(!balanceTracker.wasChecked())
                {
                    result = (balanceTracker.getBalance('Euro')-result);
                    balanceTracker.setBalance(result, 'Euro');
                    balanceTracker.setCheck(true);
                }
                else if(balanceTracker.wasChecked())
                {
                $timeout(balanceTracker.setCheck(false), 10);
                }
            }
            return result;//balanceTracker.getBalance();
        }

        return function(input, currency) {
            if (window.nfc) {
                return decodePayload(input);
            } else {
                return input.payload;
            }

        };
    });

