"use strict";
module.exports = [
	{"name":"Looks","icon":"2-外观.svg","items":[
	{"id":"test","data":"hello %{number,number,value,10} world","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} steps","type":2},
	{"id":"motion_movesteps","data":"move %{number,number,STEPS,10} stepsrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr==================","type":2}
	]},
	{"name":"Motion","icon":"1-动作.svg","items":[
	{"id":"test","data":"hello %{number,number,value,10} world","type":2}
	]},
	{"name":"Sound","icon":"3-声音.svg","items":[
	{"id":"test","data":"hello %{number,number,value,10} world","type":2}
	]},
	{"name":"Events","icon":"5-事件.svg","items":[
	{"id":"test","data":"hello %{number,number,value,10} world","type":2}
	]},
	{"name":"Control","icon":"4-控制.svg","items":[
	{"data":"for","type":5},
	{"data":"if","type":6},
	{"data":"else if","type":7},
	{"data":"else","type":8},
	{"data":"break","type":3},
	{"data":"continue","type":4},
	{"data":"arduino","type":10}
	]},
	{"name":"Sensing","icon":"6-侦测.svg","items":[
	{"id":"test","data":"hello %{number,number,value,10} world","type":2}
	]},
	{"name":"Operators","icon":"8-运算符.svg","items":[
	{"id":"test","data":"hello %{number,number,value,10} world","type":2}
	]},
	{"name":"Data","icon":"9-数据.svg","items":[
	{"id":"test","data":"hello %{number,number,value,10} world","type":2}
	]},
	{"name":"Robot","icon":"9-数据.svg","items":[
	{"id":"showFace","data":"show face %{number,number,value,10} characters:%{number,number,value,10}","type":2,cpp(){
		return "showFace()";
	}},
	{"id":"getUltrasonic","data":"ultrasonic sensor %{number,number,value,10} distance","type":1,cpp(){
		this.addInclude("WeELF328P.h");
		return "getUltrasonic()";
	}}
	]}
]