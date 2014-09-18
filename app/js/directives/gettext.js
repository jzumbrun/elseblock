angular.module("gettext",[]),angular.module("gettext").constant("gettext",function(a){return a}),angular.module("gettext").factory("gettextCatalog",["gettextPlurals","$http","$cacheFactory","$interpolate","$rootScope",function(a,b,c,d,e){var f,g=function(a){return f.debug&&f.currentLanguage!==f.baseLanguage?"[MISSING]: "+a:a};return f={debug:!1,strings:{},baseLanguage:"en",currentLanguage:"en",cache:c("strings"),setCurrentLanguage:function(a){this.currentLanguage=a,e.$broadcast("gettextLanguageChanged")},setStrings:function(a,b){this.strings[a]||(this.strings[a]={});for(var c in b){var d=b[c];this.strings[a][c]="string"==typeof d?[d]:d}},getStringForm:function(a,b){var c=this.strings[this.currentLanguage]||{},d=c[a]||[];return d[b]},getString:function(a,b){return a=this.getStringForm(a,0)||g(a),b?d(a)(b):a},getPlural:function(b,c,e,f){var h=a(this.currentLanguage,b);return c=this.getStringForm(c,h)||g(1===b?c:e),f?d(c)(f):c},loadRemote:function(a){return b({method:"GET",url:a,cache:f.cache}).success(function(a){for(var b in a)f.setStrings(b,a[b])})}}}]),angular.module("gettext").directive("translate",["gettextCatalog","$parse","$animate","$compile",function(a,b,c,d){function e(a,b,c){if(!a)throw new Error("You should add a "+b+" attribute whenever you add a "+c+" attribute.")}var f=function(){return String.prototype.trim?function(a){return"string"==typeof a?a.trim():a}:function(a){return"string"==typeof a?a.replace(/^\s*/,"").replace(/\s*$/,""):a}}();return{restrict:"A",terminal:!0,compile:function(g,h){e(!h.translatePlural||h.translateN,"translate-n","translate-plural"),e(!h.translateN||h.translatePlural,"translate-plural","translate-n");var i=f(g.html()),j=h.translatePlural;return{post:function(e,f,g){function h(){var b;j?(e=l||(l=e.$new()),e.$count=k(e),b=a.getPlural(e.$count,i,j)):b=a.getString(i);var g=angular.element("<span>"+b+"</span>");d(g.contents())(e);var h=f.contents(),m=g.contents();c.enter(m,f),c.leave(h)}var k=b(g.translateN),l=null;g.translateN&&e.$watch(g.translateN,h),e.$on("gettextLanguageChanged",h),h()}}}}}]),angular.module("gettext").filter("translate",["gettextCatalog",function(a){return function(b){return a.getString(b)}}]),angular.module("gettext").factory("gettextPlurals",function(){return function(a,b){switch(a){case"ay":case"bo":case"cgg":case"dz":case"fa":case"id":case"ja":case"jbo":case"ka":case"kk":case"km":case"ko":case"ky":case"lo":case"ms":case"my":case"sah":case"su":case"th":case"tt":case"ug":case"vi":case"wo":case"zh":return 0;case"is":return b%10!=1||b%100==11?1:0;case"jv":return 0!=b?1:0;case"mk":return 1==b||b%10==1?0:1;case"ach":case"ak":case"am":case"arn":case"br":case"fil":case"fr":case"gun":case"ln":case"mfe":case"mg":case"mi":case"oc":case"pt_BR":case"tg":case"ti":case"tr":case"uz":case"wa":case"zh":return b>1?1:0;case"lv":return b%10==1&&b%100!=11?0:0!=b?1:2;case"lt":return b%10==1&&b%100!=11?0:b%10>=2&&(10>b%100||b%100>=20)?1:2;case"be":case"bs":case"hr":case"ru":case"sr":case"uk":return b%10==1&&b%100!=11?0:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?1:2;case"mnk":return 0==b?0:1==b?1:2;case"ro":return 1==b?0:0==b||b%100>0&&20>b%100?1:2;case"pl":return 1==b?0:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?1:2;case"cs":case"sk":return 1==b?0:b>=2&&4>=b?1:2;case"sl":return b%100==1?1:b%100==2?2:b%100==3||b%100==4?3:0;case"mt":return 1==b?0:0==b||b%100>1&&11>b%100?1:b%100>10&&20>b%100?2:3;case"gd":return 1==b||11==b?0:2==b||12==b?1:b>2&&20>b?2:3;case"cy":return 1==b?0:2==b?1:8!=b&&11!=b?2:3;case"kw":return 1==b?0:2==b?1:3==b?2:3;case"ga":return 1==b?0:2==b?1:7>b?2:11>b?3:4;case"ar":return 0==b?0:1==b?1:2==b?2:b%100>=3&&10>=b%100?3:b%100>=11?4:5;default:return 1!=b?1:0}}});