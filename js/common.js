/*
var longmonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var shortmonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var longdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
*/
function percentageFixer(inNum) {
	// input: any string or floating point number representing a percentage between 0-100
	// this will handle the edge cases of < 1 and > 99 and kick them to double digit precision
	// but give single digit precision for all other cases
	// returns just the number, no % sign
	inNum = parseFloat(inNum);
	if ((inNum < 1 && inNum > 0) || (inNum > 99 && inNum < 100)) {
		outNum = inNum.toFixed(2);
	} else if (parseInt(inNum) == 100 || parseInt(inNum) == 0) {
		outNum = parseInt(inNum);
	} else {
		outNum = inNum.toFixed(1);
	}
	return outNum;
}
/**
 * Trigger a callback when 'this' image is loaded:
 * @param {Function} callback
 */
(function ($) {
	$.fn.imgLoad = function (callback) {
		return this.each(function () {
			if (callback) {
				if (this.complete || /*for IE 10-*/ $(this).height() > 0) {
					callback.apply(this);
				} else {
					$(this).on('load', function () {
						callback.apply(this);
					});
				}
			}
		});
	};
})(jQuery);

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function getQuery(name) {
    name = ''+ name;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

(function(){

	$(function(){

		dropdown_swap();
		input_clear_button();

	});

	function dropdown_swap(){
		$('body').on('click', '.dropdown-menu li a', function () {
			$(this).parents('.dropdown').removeClass('open').find('button').html($(this).text() + ' <span class="caret"></span>');
			return false;
		});
	}

	function input_clear_button(){
		$('body').on('keyup paste', 'input.form-control[type="text"]', function () {
			if ($(this).val().length > 0) {
				$(this).parent().find('.btn-link.hidden').removeClass('hidden');
			} else {
				$(this).parent().find('.btn-link').addClass('hidden');
			}
		});

		$('body').on('click', '.btn-link', function () {
			if ($(this).parent().find('input.form-control[type="text"]').length > 0) {
				$(this).addClass('hidden');
				$(this).parent().find('input.form-control[type="text"]').val('').focus();
			}
		});
	}

})();

var en_dash = "&#8211;";
var em_dash = "&#8212;";

var wsj_monthArr = {'Jan': 'Jan.', 'Feb': 'Feb.', 'Mar': 'March', 'Apr': 'April', 'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August', 'Sep': 'Sept.', 'Oct': 'Oct.', 'Nov': 'Nov.', 'Dec': 'Dec.'};
var state_names = {'AK': {'state': 'Alaska', 'postal': 'AK', 'ap': 'Alaska'}, 'AL': {'state': 'Alabama', 'postal': 'AL', 'ap': 'Ala.'}, 'AR': {'state': 'Arkansas', 'postal': 'AR', 'ap': 'Ark.'}, 'AZ': {'state': 'Arizona', 'postal': 'AZ', 'ap': 'Ariz.'}, 'CA': {'state': 'California', 'postal': 'CA', 'ap': 'Calif.'}, 'CO': {'state': 'Colorado', 'postal': 'CO', 'ap': 'Colo.'}, 'CT': {'state': 'Connecticut', 'postal': 'CT', 'ap': 'Conn.'}, 'DC': {'state': 'District of Columbia', 'postal': 'DC', 'ap': 'D.C.'}, 'DE': {'state': 'Delaware', 'postal': 'DE', 'ap': 'Del.'}, 'FL': {'state': 'Florida', 'postal': 'FL', 'ap': 'Fla.'}, 'GA': {'state': 'Georgia', 'postal': 'GA', 'ap': 'Ga.'}, 'HI': {'state': 'Hawaii', 'postal': 'HI', 'ap': 'Hawaii'}, 'IA': {'state': 'Iowa', 'postal': 'IA', 'ap': 'Iowa'}, 'ID': {'state': 'Idaho', 'postal': 'ID', 'ap': 'Idaho'}, 'IL': {'state': 'Illinois', 'postal': 'IL', 'ap': 'Ill.'}, 'IN': {'state': 'Indiana', 'postal': 'IN', 'ap': 'Ind.'}, 'KS': {'state': 'Kansas', 'postal': 'KS', 'ap': 'Kan.'}, 'KY': {'state': 'Kentucky', 'postal': 'KY', 'ap': 'Ky.'}, 'LA': {'state': 'Louisiana', 'postal': 'LA', 'ap': 'La.'}, 'MA': {'state': 'Massachusetts', 'postal': 'MA', 'ap': 'Mass.'}, 'MD': {'state': 'Maryland', 'postal': 'MD', 'ap': 'Md.'}, 'ME': {'state': 'Maine', 'postal': 'ME', 'ap': 'Maine'}, 'MI': {'state': 'Michigan', 'postal': 'MI', 'ap': 'Mich.'}, 'MN': {'state': 'Minnesota', 'postal': 'MN', 'ap': 'Minn.'}, 'MO': {'state': 'Missouri', 'postal': 'MO', 'ap': 'Mo.'}, 'MS': {'state': 'Mississippi', 'postal': 'MS', 'ap': 'Miss.'}, 'MT': {'state': 'Montana', 'postal': 'MT', 'ap': 'Mont.'}, 'NC': {'state': 'North Carolina', 'postal': 'NC', 'ap': 'N.C.'}, 'ND': {'state': 'North Dakota', 'postal': 'ND', 'ap': 'N.D.'}, 'NE': {'state': 'Nebraska', 'postal': 'NE', 'ap': 'Neb.'}, 'NH': {'state': 'New Hampshire', 'postal': 'NH', 'ap': 'N.H.'}, 'NJ': {'state': 'New Jersey', 'postal': 'NJ', 'ap': 'N.J.'}, 'NM': {'state': 'New Mexico', 'postal': 'NM', 'ap': 'N.M.'}, 'NV': {'state': 'Nevada', 'postal': 'NV', 'ap': 'Nev.'}, 'NY': {'state': 'New York', 'postal': 'NY', 'ap': 'N.Y.'}, 'OH': {'state': 'Ohio', 'postal': 'OH', 'ap': 'Ohio'}, 'OK': {'state': 'Oklahoma', 'postal': 'OK', 'ap': 'Okla.'}, 'OR': {'state': 'Oregon', 'postal': 'OR', 'ap': 'Ore.'}, 'PA': {'state': 'Pennsylvania', 'postal': 'PA', 'ap': 'Pa.'}, 'RI': {'state': 'Rhode Island', 'postal': 'RI', 'ap': 'R.I.'}, 'SC': {'state': 'South Carolina', 'postal': 'SC', 'ap': 'S.C.'}, 'SD': {'state': 'South Dakota', 'postal': 'SD', 'ap': 'S.D.'}, 'TN': {'state': 'Tennessee', 'postal': 'TN', 'ap': 'Tenn.'}, 'TX': {'state': 'Texas', 'postal': 'TX', 'ap': 'Texas'}, 'UT': {'state': 'Utah', 'postal': 'UT', 'ap': 'Utah'}, 'VA': {'state': 'Virginia', 'postal': 'VA', 'ap': 'Va.'}, 'VT': {'state': 'Vermont', 'postal': 'VT', 'ap': 'Vt.'}, 'WA': {'state': 'Washington', 'postal': 'WA', 'ap': 'Wash.'}, 'WI': {'state': 'Wisconsin', 'postal': 'WI', 'ap': 'Wis.'}, 'WV': {'state': 'West Virginia', 'postal': 'WV', 'ap': 'W.Va.'}, 'WY': {'state': 'Wyoming', 'postal': 'WY', 'ap': 'Wyo.'} };


var fipsToState = {
"02" : "AK",
"01" : "AL",
"05" : "AR",
"60" : "AS",
"04" : "AZ",
"06" : "CA",
"08" : "CO",
"09" : "CT",
"11" : "DC",
"10" : "DE",
"12" : "FL",
"13" : "GA",
"66" : "GU",
"69" : "MP",
"15" : "HI",
"19" : "IA",
"16" : "ID",
"17" : "IL",
"18" : "IN",
"20" : "KS",
"21" : "KY",
"22" : "LA",
"25" : "MA",
"24" : "MD",
"23" : "ME",
"26" : "MI",
"27" : "MN",
"29" : "MO",
"28" : "MS",
"30" : "MT",
"37" : "NC",
"38" : "ND",
"31" : "NE",
"33" : "NH",
"34" : "NJ",
"35" : "NM",
"32" : "NV",
"36" : "NY",
"39" : "OH",
"40" : "OK",
"41" : "OR",
"42" : "PA",
"72" : "PR",
"44" : "RI",
"45" : "SC",
"46" : "SD",
"47" : "TN",
"48" : "TX",
"49" : "UT",
"51" : "VA",
"78" : "VI",
"50" : "VT",
"53" : "WA",
"55" : "WI",
"54" : "WV",
"56" : "WY"
}


var stateToFips = {
  "AK": "02",
  "AL": "01",
  "AR": "05",
  "AS": "60",
  "AZ": "04",
  "CA": "06",
  "CO": "08",
  "CT": "09",
  "DC": "11",
  "DE": "10",
  "FL": "12",
  "GA": "13",
  "GU": "66",
  "HI": "15",
  "IA": "19",
  "ID": "16",
  "IL": "17",
  "IN": "18",
  "KS": "20",
  "KY": "21",
  "LA": "22",
  "MA": "25",
  "MD": "24",
  "ME": "23",
  "MI": "26",
  "MN": "27",
  "MO": "29",
  "MS": "28",
  "MT": "30",
  "NC": "37",
  "ND": "38",
  "NE": "31",
  "NH": "33",
  "NJ": "34",
  "NM": "35",
  "NV": "32",
  "NY": "36",
  "OH": "39",
  "OK": "40",
  "OR": "41",
  "PA": "42",
  "PR": "72",
  "RI": "44",
  "SC": "45",
  "SD": "46",
  "TN": "47",
  "TX": "48",
  "UT": "49",
  "VA": "51",
  "VI": "78",
  "VT": "50",
  "WA": "53",
  "WI": "55",
  "WV": "54",
  "WY": "56"
};



var sf = {
  "VA": "s",
  "ND": "b",
  "NY": "h",
  "AL": "B",
  "RI": "m",
  "NE": "c",
  "MN": "W",
  "MD": "T",
  "HI": "K",
  "DE": "H",
  "CO": "F",
  "WY": "x",
  "MO": "X",
  "ME": "U",
  "IA": "L",
  "OR": "k",
  "OH": "i",
  "KY": "Q",
  "IL": "N",
  "AZ": "D",
  "TX": "q",
  "TN": "p",
  "NH": "d",
  "GA": "J",
  "SC": "n",
  "IN": "O",
  "ID": "M",
  "SD": "o",
  "PA": "l",
  "OK": "j",
  "NJ": "e",
  "MS": "Y",
  "MI": "V",
  "FL": "I",
  "CT": "G",
  "AR": "C",
  "WI": "v",
  "MT": "Z",
  "US": "z",
  "VT": "t",
  "NV": "g",
  "KS": "P",
  "CA": "E",
  "WV": "w",
  "UT": "r",
  "NM": "f",
  "MA": "S",
  "DC": "y",
  "WA": "u",
  "NC": "a",
  "LA": "R",
  "AK": "A",
  "PR": "3"
}
