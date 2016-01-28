/**
 * Created by Mykhailo_Bohdanov on 04/11/2015.
 */
toDate = function(date) {
    return new Date(date * 1000).toLocaleString();
};

var URL = {
        MERCHANT  : {
            BASE: '/merchants'
           ,ONE : function(merchantId)         { return '/merchants/' + merchantId;                   }
        },
        USER    : {
            BASE: function(merchantId)         { return '/merchants/'+merchantId+"/users";            }
           ,ONE : function(merchantId, userId) { return '/merchants/'+merchantId+"/users/"+userId;    }
        },
        WEBSITE : {
            BASE: function(merchantId)         { return '/merchants/'+merchantId+"/websites";         }
           ,ONE : function(merchantId, siteId) { return '/merchants/'+merchantId+"/websites/"+siteId; }
           ,PAY : function(merchantId, siteId) { return '/merchants/'+merchantId+"/websites/"+siteId+"/processors";}
        },
        PAY_SYSTEM: '/processors',
        ROLES     : '/roles?lang=ru',
        CURRENCIES: '/currencies',
        LANG : {
           BASE     : 'https://demo3066372.mockable.io/api/config/lang/list',
           ONE      : 'https://demo3066372.mockable.io/api/config/lang',
           TRANSLATE: 'https://demo3066372.mockable.io/api/config/translation'
        }
    },
    CRUD = {
        CREATE: 0x1,
        READ  : 0x2,
        UPDATE: 0x4,
        DELETE: 0x8
    },
    RANDOM = {
      _chars      : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      size        : function(obj) {
         var i, count = 0;

         for (i in obj)
            if (obj.hasOwnProperty(i))
               count++;

         return count;
      },
      string      : function(length) {
         return this.iterate(this.from, this, [this._chars], length).join('');
      },
      integer     : function(min, max) {
         return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      float       : function(min, max, aMin, aMax) {
         return parseFloat(this.integer(min, max) + '.' + this.integer(aMin, aMax));
      },
      from        : function(source, index) {
         var r, size;
         if (angular.isArray(source)) {
            size = source.length;
            r = this.integer(0, size);

            return index ? r : source[r];
         } else {
            size = this.size(source);
            r = this.integer(0, size);

            for (var i in source) {
               if (source.hasOwnProperty(i) && --r <= 0) {
                  return index ? i : source[i];
               }
            }
         }
      },
      priority    : function(from, priority, index) {
         if (from.length != priority.length) {
            return this.from(from, index);
         } else {
            var i, full = 0;

            for (i = 0; i < priority.length; i++) {
               full += priority[i];
            }

            full = this.integer(0, full);

            for (i = 0; i < priority.length; i++) {
               if ((full = full - priority[i]) < priority[i]) {
                  return index ? i : from[i];
               }
            }
         }
      },
      iterate     : function(fn, context, args, count) {
         var out = [];

         for (var i = 0; i < count; i++) {
            out.push(fn.apply(context, args));
         }

         return out;
      },
      __DATA__    : {
         status      : ['CREATING', 'PROCESSING', 'FAIL', 'DONE'],
         statusP     : [5,          1,            3,      10    ],
         money       : ['UAH', 'USD', 'EUR', 'RUB'],
         moneyP      : [8,     8,     4,     8    ],
         about       : []
      },
      statistic   : function(iterate) {
         var startId     = this.integer(0, 1000),

            statRandomRange = this.integer(1800, 3600 * 6),
            endData     = new Date().getTime() / 1000,
            startData   = endData - ((iterate + 1) * statRandomRange);

         var nextTime    = (function() {
            statRandomRange = (endData - startData) / (iterate + 1);
            return parseInt(startData = this.integer(startData, startData + statRandomRange));
         }).bind(this);

         return this.iterate(function() {
            iterate--;

            return {
               id          : startId++,
               date        : nextTime(),
               paySystem   : this.from(this.__DATA__.paySystems, true),
               money       : this.priority(this.__DATA__.money, this.__DATA__.moneyP, true),
               amount      : this.float(1, 1000, 0, 99),
               status      : this.priority(this.__DATA__.status, this.__DATA__.statusP, true),
               orderId     : this.integer(1, 1000000)
            };
         }, this, null, iterate);
      }
   };

var REG_URL = /^([A-z:]+:)?(?:\/\/)?(?:([\w\-.@]*)(?::(.*))?@)?([\w-.]+)?(?::([0-9]+))?(?:(\/)([^?#\s\/]+)?|([^?#\s]*\/)([^?#\s\/]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var HOME    = REG_URL.exec(location.href);
HOME        = HOME[6] || HOME[8];
HOME = HOME + 'static/old/';

var APP     = angular.module('application', [
     'ng'
   , 'ui.router'
   , 'ngCookies'
   , 'pascalprecht.translate'
])
;