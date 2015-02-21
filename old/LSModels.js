var LSModels = [
	{
		"name": "Dragon Curve",
		"variables": "XY",
		"constants": "F+-",
		"axiom": "FX",
		"rules": {
			"X": "X+YF",
			"Y": "FX-Y"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Terdragon Curve",
		"variables": "F",
		"constants": "+-",
		"axiom": "F",
		"rules": {"F": "F+F-F"},
		"actions": {
			"F": "forward 10",
			"+": "rotate 120",
			"-": "rotate -120"
		}
	},
	{
		"name": "Lévy C Curve",
		"variables": "F",
		"constants": "+-",
		"axiom": "F",
		"rules": {"F": "+F--F+"},
		"actions": {
			"F": "forward 10",
			"+": "rotate 45",
			"-": "rotate -45"
		}
	},
	{
		"name": "Sierpiński Arrowhead Curve",
		"variables": "AB",
		"constants": "+-",
		"axiom": "A",
		"rules": {
			"A": "B+A+B",
			"B": "A-B-A"
		},
		"actions": {
			"A": "forward 10",
			"B": "forward 10",
			"+": "rotate 60",
			"-": "rotate -60"
		}
	},
	{
		"name": "Sierpiński Triangle",
		"variables": "FG",
		"constants": "+-",
		"axiom": "F-G-G",
		"rules": {
			"F": "F-G+F+G-F",
			"G": "GG"
		},
		"actions": {
			"F": "forward 10",
			"G": "forward 10",
			"+": "rotate 120",
			"-": "rotate -120"
		}
	},
	{
		"name": "Sierpiński Carpet",
		"variables": "FG",
		"constants": "+-",
		"axiom": "F",
		"rules": {
			"F": "F+F-F-F-G+F+F+F-F",
			"G": "GGG"
		},
		"actions": {
			"F": "forward 10",
			"G": "forward 10",
			"+": "rotate 90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Sierpiński Median Curve",
		"variables": "LR",
		"constants": "F+-",
		"axiom": "L--F--L--F",
		"rules": {
			"L": "+R-F-R+",
			"R": "-L+F+L-"
		},
		"actions": {
			"F": "forward 10",
			"L": "forward 10",
			"R": "forward 10",
			"+": "rotate 45",
			"-": "rotate -45"
		}
	},
	{
		"name": "Koch Curve",
		"variables": "F",
		"constants": "+-",
		"axiom": "F",
		"rules": {"F": "F+F-F-F+F"},
		"actions": {
			"F": "forward 10",
			"+": "rotate 90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Koch Snowflake",
		"variables": "F",
		"constants": "+-",
		"axiom": "F++F++F",
		"rules": {
			"F": "F-F++F-F",
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 60",
			"-": "rotate -60"
		}
	},
	{
		"name": "Fractal Plant",
		"variables": "XF",
		"constants": "+-[]",
		"axiom": "X",
		"rules": {
			"X": "F-[[X]+X]+F[+FX]-X",
			"F": "FF"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 25",
			"-": "rotate -25",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Fractal Plant 2",
		"variables": "1",
		"constants": "+-[]",
		"axiom": "1",
		"rules": {
			"1": "11+[+1-1-1]-[-1+1+1]"
		},
		"actions": {
			"1": "forward 10",
			"+": "rotate 22.5",
			"-": "rotate -22.5",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Fractal Tree",
		"variables": "AB",
		"constants": "+-[]",
		"axiom": "A",
		"rules": {
			"A": "B[-A]+A",
			"B": "BB"
		},
		"actions": {
			"A": "forward 10",
			"B": "forward 10",
			"+": "rotate 45",
			"-": "rotate -45",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Hilbert Curve",
		"variables": "AB",
		"constants": "F+-",
		"axiom": "+AF-BFB-FA+",
		"rules": {
			"A": "-BF+AFA+FB-",
			"B": "+AF-BFB-FA+"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Moore Curve",
		"variables": "LR",
		"constants": "F+-",
		"axiom": "LFL+F+LFL",
		"rules": {
			"L": "-RF+LFL+FR-",
			"R": "+LF-RFR-FL+"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Peano Curve",
		"variables": "AB",
		"constants": "F+-",
		"axiom": "AFBFA+F+BFAFB-F-AFBFA",
		"rules": {
			"A": "AFBFA+F+BFAFB-F-AFBFA",
			"B": "BFAFB-F-AFBFA+F+BFAFB"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate  90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Gosper Curve",
		"variables": "XY",
		"constants": "F+-",
		"axiom": "XF",
		"rules": {
			"X": "X+YF++YF-FX--FXFX-YF+",
			"Y": "-FX+YFYF++YF+FX--FX-Y"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 60",
			"-": "rotate -60"
		}
	},
	{
		"name": "Gosper Island",
		"variables": "F",
		"constants": "+-",
		"axiom": "F+F+F+F+F+F+",
		"rules": {
			"F": "F+F-F"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 60",
			"-": "rotate -60"
		}
	},
	{
		"name": "Penrose Tiling",
		"variables": "67891",
		"constants": "+-[]",
		"axiom": "[7]++[7]++[7]++[7]++[7]",
		"rules": {
			"6": "81++91----71[-81----61]++",
			"7": "+81--91[---61--71]+",
			"8": "-61++71[+++81++91]-",
			"9": "--81++++61[+91++++71]--71",
			"1": ""
		},
		"actions": {
			"1": "forward 10",
			"+": "rotate 36",
			"-": "rotate -36",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Cross Curve",
		"variables": "6",
		"constants": "1+-",
		"axiom": "1+61+1+61",
		"rules": {
			"6": "61-1+1-61+1+61-1+1-6"
		},
		"actions": {
			"1": "forward 10",
			"+": "rotate 90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Snake Curve",
		"variables": "6",
		"constants": "1+-",
		"axiom": "+6++6",
		"rules": {
			"6": "616++616"
		},
		"actions": {
			"1": "forward 10",
			"+": "rotate 45",
			"-": "rotate -45"
		}
	},
	{
		"name": "Campos Curve",
		"variables": "61",
		"constants": "+-",
		"axiom": "+6++6",
		"rules": {
			"6": "616++616",
			"1": "11"
		},
		"actions": {
			"1": "forward 10",
			"+": "rotate 45",
			"-": "rotate -45"
		}
	},
	{
		"name": "Spiral Curve",
		"variables": "678",
		"constants": "1+-[]",
		"axiom": "6666",
		"rules": {
			"6": "7+7+7+7+7+7+",
			"7": "[1+1+1+1[---7-8]+++++1++++++++1-1-1-1]",
			"8": "[1+1+1+1[---8]+++++1++++++++1-1-1-1]"
		},
		"actions": {
			"1": "forward 10",
			"+": "rotate 15",
			"-": "rotate -15",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Starry",
		"variables": "F",
		"constants": "+-",
		"axiom": "F-F++F-F++F-F++F-F++F-F",
		"rules": {
			"F": "F-F++F-F"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 72",
			"-": "rotate -72"
		}
	},
	{
		"name": "Cristal",
		"variables": "1",
		"constants": "+-[]",
		"axiom": "[1]+[1]+[1]+[1]+[1]+[1]",
		"rules": {
			"1": "111[1][+[1]+1][-[1]-1]"
		},
		"actions": {
			"1": "forward 10",
			"+": "rotate 60",
			"-": "rotate -60",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Hexagonal Kolam",
		"variables": "XY",
		"constants": "F+-[]",
		"axiom": "X",
		"rules": {
			"X": "[-F+F[Y]+F][+F-F[X]-F]",
			"Y": "[-F+F[Y]+F][+F-F-F]"
		},
		"actions": {
			"F": "forward 10",
			"+": "rotate 60",
			"-": "rotate -60",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Mango Kolam",
		"variables": "AZ",
		"constants": "Ff+-[]",
		"axiom": "A---A",
		"rules": {
			"A": "f-F+Z+F-fA",
			"Z": "F-FF-F--[--Z]F-FF-F--F-FF-F--"
		},
		"actions": {
			"F": "forward 10",
			"f": "hop 10",
			"+": "rotate 60",
			"-": "rotate 60",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Islands & Lakes",
		"variables": "Ff",
		"constants": "+-",
		"axiom": "F-F-F-F",
		"rules": {
			"F": "F-f+FF-F-FF-Ff-FF+f-FF+F+FF+Ff+FFF",
			"f": "ffffff"
		},
		"actions": {
			"F": "forward 10",
			"f": "hop 10",
			"+": "rotate 90",
			"-": "rotate -90"
		}
	},
	{
		"name": "Thread Plant",
		"variables": "BPT",
		"constants": "frqut[]",
		"axiom": "f",
		"rules": {
			"B": {"TB": 1, "P[rB][qB]": 1},
			"P": {"TP": 1, "T": 1, "TT": 1, "TTT": 1},
			"T": {"frfrfrfr": 1, "fqfqfqfq": 1, "fufufufu": 1, "ftftftft": 1}
		},
		"actions": {
			"f": "forward 10",
			"r": "rotate 10",
			"q": "rotate -10",
			"t": "rotate 13",
			"u": "rotate -13",
			"[": "branch",
			"]": "home"
		}
	},
	{
		"name": "Random Walk",
		"variables": "F",
		"constants": "+-",
		"axiom": "F",
		"rules": {"F": {"F+F": 1, "F-F": 1}},
		"actions": {
			"F": "forward 10",
			"+": "rotate 60",
			"-": "rotate -60"
		}
	}
];
