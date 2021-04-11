(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){"use strict";var md=new MobileDetect(window.navigator.userAgent);var slideout=new Slideout({panel:document.getElementById("panel"),menu:document.getElementById("menu"),padding:256});d3.select("#toggle-button").on("click",function(){slideout.toggle()});var app={color:d3.scaleSequential(d3.interpolateViridis).domain([1850,2021]),countDone:0,dispatch:d3.dispatch("end","show"),duration:10,fadeDuration:3e3,format:d3.format(".1f"),formatYear:d3.timeFormat("%Y"),margin:{top:0,right:20,bottom:20,left:40},padding:10,red:"#CC0074",root:"../",running:false,viz:[]};app.setWidth=function(count){return d3.min([700,Math.floor((window.innerWidth-20*count)/count)])};app.heightLineChart=200-app.margin.top-app.margin.bottom;app.showMobileWarning=function(){if(md.mobile()){var alert=d3.select("div#alert");alert.style("display","block").on("click",function(){alert.style("display","none")})}};app.fastForward=function(){d3.selectAll(".vertical-line, .hover-text").attr("visibility","hidden");if(app.running){d3.select("#status").classed("icon-play3",true);d3.select("#status").classed("icon-pause2",false);app.viz.forEach(function(v){v.svg.dispatch("end")})}else{d3.select("#status").classed("icon-play3",false);d3.select("#status").classed("icon-pause2",true);app.viz.forEach(function(v){v.svg.dispatch("start")})}app.running=!app.running};app.dispatch.on("end",function(){d3.selectAll("svg, span#status").on("click",null);app.countDone+=1;d3.select("#status").style("opacity",.2);app.running=false;if(app.countDone===app.viz.length){app.countDone=0;d3.timeout(function(){d3.selectAll("text.year").text("");d3.selectAll("path.period").transition().duration(app.fadeDuration).attr("opacity",0);d3.timeout(function restart(){app.start();d3.select("#status").style("opacity",1)},app.fadeDuration)},3500)}});app.dispatch.on("show",function(){var year=this.year;var month=this.month||12;app.viz.forEach(function(v){v.showUntil(year,month)})});app.start=function(){app.viz.forEach(function(v){v.svg.dispatch("start")});d3.selectAll("svg, span#status").on("click",app.fastForward);app.running=true};module.exports=app},{}],2:[function(require,module,exports){"use strict";var app=require("./app.js");var duration=app.duration;var color=app.color;module.exports=function radialChart(){var radius=app.radius;var width=app.width;var height=app.height;chart.unit="GtCO2";var co2cumsum=2410;var budget1_5=440;var budget1_5_lower=230;var budget1_5_upper=670;var budget2_0=1375;var budget2_0_lower=1110;var budget2_0_upper=1655;var rangeOpacity=.35;var rangeLineOpacity=.6;var rangeStrokeWidth=2;var rangeStrokeDashArray="5, 2";var medianOpacity=.8;var scaleCumulativeEmissions=d3.scaleLinear().domain([0,co2cumsum+budget2_0_upper]).range([0,2*Math.PI]);var arc=d3.arc().innerRadius(.2*radius).outerRadius(radius-2).startAngle(function(d){return scaleCumulativeEmissions(d[0].cumulative)}).endAngle(function(d){return scaleCumulativeEmissions(d[1].cumulative)});function chart(selection){var data=selection.data()[0];chart.data=data;chart.lastYear=data[data.length-1].year;var svg=selection.append("svg").attr("class","circle").attr("width",app.width).attr("height",app.height).attr("viewBox","0 0 "+width+" "+height).attr("preserveAspectRatio","xMidYMid meet").append("g").attr("transform","translate("+width/2+","+height/2+")");var grEmis=svg.append("g").attr("class","r axis").selectAll("g").data([.2*radius,radius]).enter().append("g");grEmis.append("circle").attr("r",function(d){return d});svg.append("path").attr("d",arc([{cumulative:co2cumsum+budget1_5_lower},{cumulative:co2cumsum+budget1_5_upper}])).attr("stroke",app.red).attr("fill",app.red).attr("stroke-width",2).attr("opacity",rangeOpacity);svg.append("path").attr("d",arc([{cumulative:co2cumsum+budget1_5_lower},{cumulative:co2cumsum+budget1_5_upper}])).attr("stroke",app.red).attr("stroke-width",rangeStrokeWidth).attr("opacity",rangeLineOpacity).style("stroke-dasharray",rangeStrokeDashArray);svg.append("path").attr("d",arc([{cumulative:co2cumsum+budget1_5},{cumulative:co2cumsum+budget1_5}])).attr("stroke",app.red).attr("fill",app.red).attr("stroke-width",2).attr("opacity",medianOpacity);svg.append("path").attr("d",arc([{cumulative:co2cumsum+budget2_0_lower},{cumulative:co2cumsum+budget2_0_upper}])).attr("stroke",app.red).attr("fill",app.red).attr("stroke-width",2).attr("opacity",rangeOpacity);svg.append("path").attr("d",arc([{cumulative:co2cumsum+budget2_0_lower},{cumulative:co2cumsum+budget2_0_upper}])).attr("stroke",app.red).attr("stroke-width",rangeStrokeWidth).attr("opacity",rangeLineOpacity).style("stroke-dasharray",rangeStrokeDashArray);svg.append("path").attr("d",arc([{cumulative:co2cumsum+budget2_0},{cumulative:co2cumsum+budget2_0}])).attr("stroke",app.red).attr("fill",app.red).attr("stroke-width",2).attr("opacity",medianOpacity);svg.append("text").text("1.5 °C Budget").attr("class","budget-line").attr("x",-.95*radius).attr("transform","rotate(-15)");svg.append("text").text("2 °C Budget").attr("class","budget-line").attr("x",-.95*radius).attr("transform","rotate(68)");chart.text=svg.append("text").attr("class","year").attr("x",-17).attr("dy",5);data.forEach(function(item,index){if(index>=data.length-1){return}var currentData=data.slice(index,index+2);svg.append("path").datum(currentData).attr("class","period").attr("d",arc(currentData)).attr("stroke",color(currentData[0].year)).attr("fill",color(currentData[0].year)).attr("opacity",0)});svg.on("start",chart.run);svg.on("end",chart.stop);chart.svg=svg}chart.run=function(){chart.svg.selectAll("path.period[opacity='0']").transition().delay(function(d,index){chart.text.transition().delay(index*12*duration).text(d[0].year);if(d[1].year===chart.lastYear){chart.text.transition().delay((index+1)*12*duration).text(chart.lastYear)}return(index+1)*duration*12}).attr("opacity",1).on("end",function(d){if(d[d.length-1].year===chart.lastYear){app.dispatch.call("end");chart.running=false}});chart.running=true};chart.stop=function(){chart.text.interrupt();chart.svg.selectAll("path.period").interrupt();chart.svg.selectAll("path.period:not([opacity='0'])").attr("opacity",1);chart.running=false};chart.showUntil=function(year){chart.svg.selectAll("path.period").attr("opacity",function(d){return d[1].year<=year?1:0});chart.text.text(d3.min([year,chart.lastYear]))};return chart}},{"./app.js":1}],3:[function(require,module,exports){"use strict";var app=require("./app.js");var duration=app.duration;var color=app.color;var margin=app.margin;var padding=app.padding;var formatYear=app.formatYear;var format=app.format;module.exports=function emissionsChart(){var width=app.width-app.margin.left-app.margin.right;var height=app.heightLineChart;var domain=[0,1];var unit="";var delay=function(d,index){return index*duration};var xScale=d3.scaleTime().domain([new Date(1850,1,1),new Date(2021,12,31)]).range([padding,width]).clamp(true);var yScale=d3.scaleLinear().domain(domain).range([height-padding,padding]);var xAxis=d3.axisBottom().scale(xScale).tickFormat(formatYear);var yAxis=d3.axisLeft().scale(yScale);var line=d3.line().x(function(d){if(d.month){return xScale(new Date(d.year,d.month))}else{return xScale(new Date(d.year,0))}}).y(function(d){return yScale(d.value)});var mousemove=function(){if(chart.running){return false}var date=xScale.invert(d3.mouse(this)[0]);var year=date.getFullYear();var month=date.getMonth();app.dispatch.call("show",{year:year,month:month})};function chart(selection){var data=selection.data()[0];chart.data=data;chart.lastYear=data[data.length-1].year;var svg=selection.append("svg").attr("width",width+margin.left+margin.right).attr("height",height+margin.top+margin.bottom).append("g").attr("transform","translate("+margin.left+","+margin.top+")");var lines=svg.append("g");svg.append("g").attr("transform","translate(0,"+height+")").attr("class","x axis").call(xAxis);svg.append("g").attr("class","y axis").call(yAxis);chart.vertLine=svg.append("line").attr("class","vertical-line").attr("y1",yScale.range()[0]).attr("y2",yScale.range()[1]).attr("stroke","gray").attr("stroke-width","1");chart.vertLineText=svg.append("text").attr("class","hover-text");svg.append("rect").attr("width",width).attr("height",height).style("fill","none").style("pointer-events","all").on("mousemove",mousemove);data.forEach(function(item,index){if(index>=data.length-1){return}var currentData=data.slice(index,index+2);lines.append("path").datum(currentData).attr("d",line).attr("class","period").attr("stroke",color(currentData[0].year)).attr("opacity",0)});svg.on("start",chart.run);svg.on("end",chart.stop);chart.svg=svg}chart.domain=function(value){if(!arguments.length)return domain;domain=value;yScale.domain(domain);return chart};chart.unit=function(value){if(!arguments.length)return unit;unit=value;return chart};chart.delay=function(value){if(!arguments.length)return delay;delay=value;return chart};chart.run=function(){chart.svg.selectAll("path.period[opacity='0.2']").attr("opacity",0);chart.svg.selectAll("path.period[opacity='0']").transition().delay(delay).attr("opacity",1).on("end",function(d){if(d[d.length-1].year===chart.lastYear){app.dispatch.call("end");chart.running=false}});chart.svg.select("rect").on("mousemove",null);chart.running=true};chart.stop=function(){chart.svg.select("rect").on("mousemove",mousemove);chart.svg.selectAll("path.period").interrupt();chart.svg.selectAll("path.period:not([opacity='0'])").attr("opacity",1);chart.svg.selectAll("path.period[opacity='0']").attr("opacity",.2);chart.running=false};chart.showUntil=function(year,month){var date=new Date(year,month);chart.svg.selectAll("path.period").attr("opacity",function(d){if(d[1].year<year||d[1].year===year&&d[1].month<=month){return 1}else{return.2}});var value=chart.data.find(function(item){if(item.month){return item.year===year&&item.month===month}else{return item.year===year}});if(value&&value.value!==null){value=format(value.value)+" "+unit}else{value=""}chart.vertLine.attr("visibility","visible").attr("x1",xScale(date)).attr("x2",xScale(date));chart.vertLineText.attr("visibility","visible").attr("x",xScale(date)).attr("y",.2*yScale.range()[0]).text(value);var bbox=chart.vertLineText.node().getBBox();chart.vertLineText.attr("dx","-"+(bbox.width+5)+"px")};return chart}},{"./app.js":1}],4:[function(require,module,exports){"use strict";var app=require("./app.js");function row(d){var obj={year:+d.year,value:+d.value};if(d.month){obj.month=+d.month}return obj}module.exports={emissionsData:function loadEmissions(callback){d3.csv("../emissions.csv",row,function(error,data){if(error)throw error;data=data.map(function(item,index,list){if(index>0){item.cumulative=list[index-1].cumulative+item.value}else{item.cumulative=item.value}return item});app.emissionsData=data;callback(null)})},concentrationData:function loadConcentrations(callback){d3.csv("../concentrations.csv",row,function(error,data){if(error)throw error;app.concentrationData=data;callback(null)})},concentrationNHData:function loadConcentrations(callback){d3.csv("../concentrations_nh.csv",row,function(error,data){if(error)throw error;app.concentrationNHData=data;callback(null)})},concentrationSHData:function loadConcentrations(callback){d3.csv("../concentrations_sh.csv",row,function(error,data){if(error)throw error;app.concentrationSHData=data;callback(null)})},temperatureData:function loadTemperature(callback){d3.csv("../temperatures.csv",row,function(error,data){if(error)throw error;app.temperatureData=data;callback(null)})}}},{"./app.js":1}],5:[function(require,module,exports){"use strict";var app=require("./app.js");var duration=app.duration;var color=app.color;module.exports=function radialChart(){var radius=app.radius;var width=app.width;var height=app.height;var domain=[0,1];var unit="";var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];var timescale=d3.scaleLinear().range([2/12*Math.PI,2*Math.PI]).domain([1,12]);var r=d3.scaleLinear().range([0,radius]);var line=d3.radialLine().radius(function(d){return r(d.value)}).angle(function(d){return timescale(d.month)});function chart(selection){var data=selection.data()[0];chart.data=data;chart.lastYear=data[data.length-1].year;chart.lastMonth=data[data.length-1].month;var svg=selection.append("svg").attr("class","circle").attr("width",app.width).attr("height",app.height).attr("viewBox","0 0 "+width+" "+height).attr("preserveAspectRatio","xMidYMid meet").append("g").attr("transform","translate("+width/2+","+height/2+")");var gr=svg.append("g").attr("class","r axis").selectAll("g").data(r.ticks(4).slice(1)).enter().append("g");gr.append("circle").attr("r",r);gr.append("text").attr("y",function(d){return-r(d)-4}).style("text-anchor","middle").text(function(d){return d+" "+unit});var leg=svg.append("g").attr("class","r axis").selectAll("g").data(timescale.ticks(12).slice(0,11)).enter().append("g");leg.append("text").attr("y",-1.05*radius).attr("transform",function(d){return"rotate("+30*d+")"}).style("text-anchor","middle").text(function(d){return months[d-1]});chart.text=svg.append("text").attr("class","year").attr("x",-17).attr("dy",5);data.forEach(function(item,index){if(index>=data.length-1){return}var currentData=data.slice(index,index+2);if(currentData[1].year>chart.lastYear){return}var interpolate=d3.interpolate(currentData[0].value,currentData[1].value);var points=4;var interpolatedData=d3.range(points+1).map(function(index){var obj={value:interpolate(index/points),month:currentData[0].month+index/points,year:currentData[0].year};return obj});svg.append("path").datum(interpolatedData).attr("class","period").attr("d",line).attr("opacity",0).attr("fill","none")});var pathSize=svg.selectAll("path.period").size();chart.last=d3.select(svg.selectAll("path.period").nodes()[pathSize-1]);svg.on("start",chart.run);svg.on("end",chart.stop);chart.svg=svg}chart.run=function(){chart.svg.selectAll("path.period[opacity='0']").attr("stroke-width",10).attr("stroke","white").transition().delay(function(d,index){if(d[0].month===1){chart.text.transition().delay(index*duration).text(d[0].year)}return index*duration}).attr("opacity",.5).attr("stroke-width",2).attr("stroke",function(d){return color(d[0].year)}).on("end",function(d){if(d[d.length-1].year===chart.lastYear&&d[d.length-1].month===chart.lastMonth){chart.running=false;app.dispatch.call("end")}});chart.running=true};chart.stop=function(){chart.text.interrupt();chart.svg.selectAll("path.period").interrupt();chart.svg.selectAll("path.period:not([opacity='0'])").transition().duration(100).attr("stroke-width",2).attr("opacity",.5).attr("stroke",function(d){return color(d[0].year)});chart.running=false};chart.showUntil=function(year,month){chart.svg.selectAll("path.period").attr("stroke-width",2).attr("stroke",function(d){return color(d[0].year)}).attr("opacity",function(d){if(d[1].year<year||d[1].year===year&&d[1].month<=month){return.5}else{return 0}});chart.text.text(d3.min([year,chart.lastYear]))};chart.domain=function(value){if(!arguments.length)return domain;domain=value;r.domain(domain);return chart};chart.unit=function(value){if(!arguments.length)return unit;unit=value;return chart};return chart}},{"./app.js":1}],6:[function(require,module,exports){"use strict";var app=require("./app");var load=require("./load-data.js");var viz=require("./viz.js");app.showMobileWarning();app.width=600;app.height=app.width;app.radius=app.width/2-35;var q=d3.queue();q.defer(load.temperatureData);q.await(function startVisualisation(error){if(error)throw error;viz.temperatureSpiral();viz.temperatureLinear();app.start()})},{"./app":1,"./load-data.js":4,"./viz.js":7}],7:[function(require,module,exports){"use strict";var app=require("./app");var budgetChart=require("./budget-chart");var spiralChart=require("./spiral-chart");var linearChart=require("./linear-chart");module.exports={emissionsBudget:function(){var budget=budgetChart();app.viz.push(budget);d3.select("#emissions-budget").datum(app.emissionsData).call(budget);return budget},emissionsLinear:function(){var emissionsLinear=linearChart().domain([0,45]).unit("GtCO₂").delay(function(d,index){return(index+1)*app.duration*12});app.viz.push(emissionsLinear);d3.select("#emissions-linear").datum(app.emissionsData).call(emissionsLinear)},concentrationSpiral:function(id,data){if(typeof id==="undefined"){id="#concentration-spiral"}if(typeof data==="undefined"){data=app.concentrationData}var concentrationSpiral=spiralChart().domain([250,450]).unit("ppm");app.viz.push(concentrationSpiral);d3.select(id).datum(data).call(concentrationSpiral);return concentrationSpiral},concentrationLinear:function(id,data){if(typeof id==="undefined"){id="#concentration-linear"}if(typeof data==="undefined"){data=app.concentrationData}var concentrationLine=linearChart().domain([270,450]).unit("ppm");app.viz.push(concentrationLine);d3.select(id).datum(data).call(concentrationLine)},temperatureSpiral:function(){var temperatureSpiral=spiralChart().domain([-.75,2]).unit("°C");app.viz.push(temperatureSpiral);d3.select("#temperature-spiral").datum(app.temperatureData).call(temperatureSpiral).selectAll("circle").attr("class",function(d){if(d===1.5){return"red"}});return temperatureSpiral},temperatureLinear:function(){var temperatureLinear=linearChart().domain([-.1,2.1]).unit("°C");app.viz.push(temperatureLinear);d3.select("#temperature-linear").datum(app.temperatureData).call(temperatureLinear)}}},{"./app":1,"./budget-chart":2,"./linear-chart":3,"./spiral-chart":5}]},{},[6]);
