(function( $ ){
	var index = 0; //定义地图默认界面的指数
    var _data = window.getData( index );
    var myChart;
	
	var chart_path = './framework/echarts/echarts';
    var map_path = './framework/echarts/echarts-map';
    var mapHeight = $('#map')[0].clientHeight;
    var timelineY = ( mapHeight-80) + 'px';

    // 路径配置
    require.config({
        paths:{ 
            echarts:chart_path,
            'echarts/chart/bar': chart_path, 'echarts/chart/pie': chart_path, 'echarts/chart/line': chart_path, 'echarts/chart/k': chart_path, 'echarts/chart/scatter': chart_path, 'echarts/chart/radar': chart_path, 'echarts/chart/chord': chart_path, 'echarts/chart/force': chart_path, 'echarts/chart/map': map_path, 'echarts/chart/config':'./framework/echarts/config',
        } 
    });

    // 使用
    require(
        [   
            'echarts',
            'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            myChart = ec.init($('#map')[0]); 
            var txt = $('.btn-default')[index].innerHTML;
            //初始的数据是当前年份的
            initMap( myChart , _data, txt );
        }
    );



    function initMap(chart_, data_, txt_, year_){

        var option = {
            timeline:{
                data:[
                    '2010','2011','2012','2013'
                ],
                label : {
                	textStyle:{
                		color:'#0E97E6',
                		fontSize:'16',
                		fontWeight:'bold'
                	},
                    formatter : function(s) {
                        return s.slice(0,4);
                    }
                },
                padding:[5,5,5,10],
                checkpointStyle:{
                    symbol : 'auto',
                    symbolSize : '5',
                    color : '#0E97E6',
                    borderColor : '#0E97E6',
                    borderWidth : '5',
                    label: {
                        show: false,
                        textStyle: {
                            color: '#0E97E6'
                        }
                    }
                },
              
                // symbolSize:auto,
                // autoPlay : true,
                // controlPosition:'left',
                controlPosition:'none',
                x:'20%',
                y:timelineY,
                height:60,
                width:'60%'
            },

            options:[
                {
                    title : {
                        'text':'2010',
                        'subtext':'数据来自国家统计局',
                        x:'center',
                        y:'top',
                        textAlign:'center',
                        itemGap:10, 
                        textStyle:{
                            fontSize:18,
                            fontFamily:'Microsoft YaHei,WenQuanYi Micro Hei,tohoma,sans-serif'
                        }
                        ,
                        subtextStyle:{
                            padding:[5,5,20,5]
                        }
                    },
                    tooltip : {
                        'trigger':'item',
                        formatter: function( params){
                            var html = '<span style="color:#fff;fontStyle:block;font-size:18px;line-height:35px;">'+this._option.title.text+'</span><br>'+params[5].name + ' ' + params[1] + '<br>' + '排名第'+params[5].value;
                            return html;
                        }
                    },
                    toolbox: {
                        show : true,
                        orient : 'horizontal',
                        itemSize:20,
                        itemGap:20, 
                        x: 'right',
                        y: 'top',
                        feature : {
                            mark : {show: false},
                            dataView : {show: false, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    dataRange: {
                        min: 0,
                        max : 188,
                        text:['排名靠后\n','\n排名靠前'],           // 文本，默认为数值文本
                        padding:[25,10,25,10],
                        calculable : true,
                        splitNumber:188,
                        x: 40,
                        y:'bottom',
                        color: ['#FA5050','#F5C38C','#F4EB9F','#5FBEAC','#1A3B41']
                    },
                    series : [
                        {
                            name: '2010',
                            roam:true,
                            scaleLimit:{max:1.2,min:1},
                            mapLocation:{y:60},
                            type: 'map',
                            mapType: 'world',
                            selectedMode : 'multiple',
                            itemStyle:{
                                normal:{label:{show:false}},
                                emphasis:{label:{show:true},
                                    color:'rgba(255,255,255,.4)',
                                    areaStyle:function( e){
                                        console.log( e );
                                        return e;
                                    }
                                }
                            },
                            'data':data_.data.year[0],
                            'nameMap' : data_.nameMap,
                            markPoint:{
                                data:[
                                ]
                            },
                            geoCoord:{
                            }
                        }
                    ]
                },
                {
                    title : {'text':'2011'},
                    series : [
                        {'data':data_.data.year[1],
                            'nameMap' : data_.nameMap}
                    ]
                }, 
                {
                    title : {'text':'2012'},
                    series : [
                        {'data':data_.data.year[2],
                            'nameMap' : data_.nameMap}
                    ]
                },
                {
                    title : {'text':'2013'},
                    series : [
                        {'data':data_.data.year[3],
                            'nameMap' : data_.nameMap}
                    ]
                }
            ]  
        };
    
        /* 设置timeline的下标 */
        if( typeof(year_) == 'undefined' || year == '' ){
            //获取当前年份
            var year = new Date().getFullYear()-1;
            var years = option.timeline.data;
            for( var i=0; i<years.length; i++ ){
                if( years[i] === (year+'') ){
                    option.timeline.currentIndex = i;
                    break;
                }
            }
        }else{
        	option.timeline.currentIndex = year_;
        }

        /* 设置标题 */
        for( var i=0, len=option.options.length; i<len; i++ ){
            option.options[i].title.text += ('年'+txt_ );
        }
        
        var ecConfig = require('echarts/config');
        function eConsole(param) {
            var html = '<div class="rank_item"><a href="#" class="rank_item_close"><div class="rank_item_icon"></div></a><span>' + param.data.name +'</span>排名'+param.value+' 百分比为'+param.data.number+'%('+this._option.title.text+')</div>';
            if( ! $.rank.hasClass('rank_content_right') ){
                $.rank.addClass('rank_content_right');
            }
            $.rank.children('.rank_content').append(html);
            var rank_items = $('.rank_item_icon');
            $(rank_items[rank_items.length-1]).on('click', function(event) {
                $(this).parent().parent().remove();
            });
        }
      
        // 为 map 上每个国家添加点击事件
        chart_.on(ecConfig.EVENT.CLICK, eConsole);
        chart_.on(ecConfig.EVENT.MAP_SELECTED, function (param) {
            console.log( param );
            var markpoint = {};
            var obj = {};
            obj['name'] = param.target;
            var odata = [];
            odata.push( obj );
            markpoint.symbol = 'heart';
            markpoint.data = odata;
            chart_.addMarkPoint(0, markpoint);
        });

        // 为echarts对象加载数据 
        chart_.setOption(option, true); 
    }


    var btns = $('.btn-default');
    for( var i=0; i<btns.length; i++ ){
        btns[i].onclick = function(){
            var slf = this;
            for( var j=0; j<btns.length; j++){
                if( btns[j] === slf ) break;
            }
            _data = window.getData( j );
            var txt = btns[j].innerHTML; //指数类别
            var index_ = myChart._timeline.currentIndex;   //指数切换按钮点击事件前，地图timeline的当前下标（即年份）
            initMap( myChart, _data, txt, index_ );
        }
    }
})(jQuery);