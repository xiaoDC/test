(function( $ ){
	var index = 0; //定义地图默认界面的指数
    var _data = window.getData( index );
    var evironment;
    var myChart;
    var myLineChart;
    var option;
    var nationSelected = window.getSelectedData();
	
	var chart_path = './framework/echarts/echarts';
    var map_path = './framework/echarts/echarts-map';
    var timelineY = ( $('#map')[0].clientHeight - 80) + 'px';

    // 路径配置
    require.config({
        paths:{ 
            echarts:chart_path,
            'echarts/chart/bar': chart_path, 
            'echarts/chart/pie': chart_path, 
            'echarts/chart/line': chart_path, 
            'echarts/chart/k': chart_path, 
            'echarts/chart/scatter': chart_path, 
            'echarts/chart/radar': chart_path, 
            'echarts/chart/chord': chart_path, 
            'echarts/chart/force': chart_path, 
            'echarts/chart/map': map_path, 
            'echarts/chart/config':'./framework/echarts/config'
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
            evironment = ec;
            myChart = init( $('#map')[0], myChart );

            var ecConfig = require('echarts/config');
            // 为 map 上每个国家添加点击事件
            myChart.on(ecConfig.EVENT.CLICK, eConsole);

            myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param) {
                var _name = param.target;
                var obj = {};
                obj['name'] = _name;
                //控制重复点击
                if( nationSelected[_name] ){   //点击过,则移除标注
                    //移除地图上的标注
                    var marks = this._option.series[0].markPoint.data;
                    for( var i=0; i<marks.length; i++){
                        if( marks[i].name === _name ){
                            marks.splice(i,1);
                        }
                    }
                    option.options[0].series[0].markPoint.data = marks;
                    myChart.setOption( option, true ); //此处调用_this.refresh() 也可以
                }else{   //未点击，添加标注
                    option.options[0].series[0].markPoint.data.push( obj );
                    myChart.setOption( option,true );
                }
            
            });

            

            var txt = $('.btn-default')[index].innerHTML;
            //初始的数据是当前年份的
            updateMap( myChart , _data, txt );
        }
    );

    //初始化line、map等控件
    function init( el, chart_el ){
        chart_el = evironment.init( el ); 
        return chart_el;
    }

    //添加折线图
    function addLineChart( param){
        //添加折线图
        var rank_line = $('.item_line');
        var rank_item = $(rank_line[rank_line.length-1]);

        var myLineChart = init( rank_item[0], myLineChart );
        var option_line = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['世界捐赠指数','助陌生人指数','资金援助指数','志愿服务指数']
            },
           
            xAxis : [
                {
                    type : 'category',
                    position:'left',
                    boundaryGap : false,
                    data : ['2010','2011','2012','2013']
                }
            ],
            yAxis : [
                {
                    position:'top',
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'世界捐赠指数',
                    type:'line',
                    smooth: true,
                    symbol: 'emptyCircle',
                    data:[]
                },
                {
                    name:'助陌生人指数',
                    type:'line',
                    smooth: true,
                    symbol: 'emptyCircle',     // 系列级个性化拐点图形
                    data:[]
                },
                {
                    name:'资金援助指数',
                    type:'line',
                    smooth: true,
                    symbol: 'emptyCircle',
                    data:[]                    },
                {
                    name:'志愿服务指数',
                    type:'line',
                    smooth: true,
                    symbol:'emptyCircle',
                    data:[]
                }
            ]
        };

        var line_data = getLineData( param.data.name , 4, 4 );
        for( var i=0; i<option_line.series.length; i++){
            option_line.series[i].data = line_data[i];
        }
                            
        myLineChart.setOption( option_line, true );
    }

    // map添加点击的监听事件
    function eConsole(param) {
        //地图上点击，左侧边栏添加折线图
        this.restore();
        // this.setOption( option, true);

        var _name_ = param.data.name;
        var regS = new RegExp(" ","g");
        _name_ =  _name_.replace( regS, '_');

        if(  !nationSelected[ param.name ] ){ //添加折线图
            nationSelected[ param.name ] = true;
        
            var html = '<div class="rank_item"><a href="#" class="rank_item_close"><div class="rank_item_icon"></div></a><span>' + param.data.name +' ' + param.name +'</span><div class="item_line" id="item_line_'+_name_+'"></div></div>';
            if( ! $.rank.hasClass('rank_content_right') ){
                $.rank.addClass('rank_content_right');
            }
            $.rank.children('.rank_content').append(html);
            
            var _this = this;
            //单个item的关闭
            var rank_items = $('.rank_item_icon');
            $(rank_items[rank_items.length-1]).on('click', function(event) {
                //移除地图上的标注
                var marks = _this._option.series[0].markPoint.data;
                for( var i=0; i<marks.length; i++){
                    if( marks[i].name === param.name ){
                        marks.splice(i,1);
                    }
                }
                option.options[0].series[0].markPoint.data = marks;
                _this.setOption( option, true ); //此处调用_this.refresh() 也可以
                //左侧边栏移除相应点的信息（包括折线图）
                $(this).parent().parent().remove();
            });

            addLineChart( param );
        }else{ // 已存在，删除折线图
            nationSelected[ param.name ] = false;
            var $link_chart = $('#item_line_' + _name_ );
            $link_chart.parent().remove();
        }
        
    }

    function updateMap(chart_, data_, txt_, year_){

        option = {
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
                            scaleLimit:{max:5.2,min:1},
                            mapLocation:{y:60},
                            type: 'map',
                            mapType: 'world',
                            selectedMode : 'multiple',
                            itemStyle:{
                                normal:{label:{show:false}},
                                emphasis:{label:{show:true}, color:'rgba(255,222,222, .3)'}
                            },
                            'data':data_.data.year[0],
                            'nameMap' : data_.nameMap,
                            markPoint:{
                                symbol:'images/pin.png',
                                data:[
                                ]
                            },
                            geoCoord:{
                                // 
                                '阿富汗':[69.1018,34.3143],
                                '安哥拉':[13.3,-9],
                                '阿尔巴尼亚':[19.5,41.2],
                                '阿联酋':[55.2514,24.2835],
                                '阿根廷':[-58.253,-34.3644],
                                '亚美尼亚':[44.3032,40.934],
                                '法属南半球和南极领地':[],
                                '澳大利亚':[149.229,-35.2059],
                                '奥地利':[16.2,48.13],
                                '阿塞拜疆':[49.5334,40.23],
                                '布隆迪':[29.22,-3.23],
                                '比利时':[4.2,50.5],
                                '贝宁':[2.37,6.29],
                                '布基纳法索':[-1.31,12.22],
                                '孟加拉国':[90.2425,23.4236],
                                '没有名字':[23.19,42.41],
                                '巴哈马':[-77.2021,25.358],
                                '波斯尼亚和黑塞哥维那':[18.26,43.52],
                                '白俄罗斯':[53.5,27.3],
                                '伯利兹':[-88.4626,17.1456],
                                '百慕大':[-64.4757,32.184],
                                '玻利维亚':[-68.851,-16.3],
                                '巴西':[-47.5353,-15.4732],
                                '文莱':[114.5655,4.5627],
                                '不丹':[89.3813,27.2822],
                                '博茨瓦纳':[25.55,-24.45],
                                '中非共和国':[18.35,4.22],
                                '加拿大':[-75.4154,45.2442],
                                '瑞士':[6.09,46.12],
                                '智利':[-70.3832,-33.288],
                                '中国':[116.391549,39.923264],
                                '象牙海岸':[5.17,6.49],
                                '喀麦隆':[11.31,3.52],
                                '刚果民主共和国':[-3.73,24.22],
                                '刚果共和国':[-4.2,15.2],
                                '哥伦比亚':[-74.458,4.3639],
                                '哥斯达黎加':[-84.455,9.5538],
                                '古巴':[-82.2318,23.7],
                                '北塞浦路斯':[],
                                '塞浦路斯':[33.2225,35.103],
                                '捷克共和国':[14.26,50.05],
                                '德国':[13.25,52.3],
                                '吉布提':[43.09,11.36],
                                '丹麦':[12.35,55.4],
                                '多明尼加共和国':[18.3,-69.5],
                                '阿尔及利亚':[36.4,3.1],
                                '厄瓜多尔':[-78.3043,0.1323],
                                '埃及':[31.15,30.03],
                                '厄立特里亚':[38.53,15.2],
                                '西班牙':[2.1,41.25],
                                '爱沙尼亚':[59.3,24.6],
                                '埃塞俄比亚':[9.0,38.4],
                                '芬兰':[24.58,60.1],
                                '斐':[178.25,18.08],
                                '福克兰群岛':[],
                                '法国':[2.2,48.52],
                                '加蓬':[9.27,0.23],
                                '英国':[0.1,51.3],
                                '格鲁吉亚':[44.4733,41.4235],
                                '加纳':[0.15,5.33],
                                '几内亚':[10.68,-11.9],
                                '冈比亚':[16.39,13.28],
                                '几内亚比绍':[-15.35,11.51],
                                '赤道几内亚':[8.46,3.45],
                                '希腊':[23.43,37.58],
                                '格陵兰':[-51.4317,64.11],
                                '危地马拉':[-90.32,14.3713],
                                '法属圭亚那':[-52.1949,4.565],
                                '圭亚那':[-58.916,6.482],
                                '洪都拉斯':[87.13,14.06],
                                '克罗地亚':[15.58,45.48],
                                '海地':[-72.2012,18.3222],
                                '匈牙利':[19.05,47.3],
                                '印尼':[106.5042,6.1242],
                                '印度':[77.1311,28.3758],
                                '爱尔兰':[6.15,53.2],
                                '伊朗':[51.2522,35.4146],
                                '伊拉克':[44.256,33.1955],
                                '冰岛':[21.51,64.09],
                                '以色列':[34.4611,32.242],
                                '意大利':[14.17,40.51],
                                '牙买加':[-76.4732,17.5934],
                                '约旦':[35.5558,31.5658],
                                '日本':[139.4927,35.407],
                                '哈萨克斯坦':[76.57,43.15],
                                '肯尼亚':[-1.2,36.5],
                                '吉尔吉斯斯坦':[42.5,74.4],
                                '柬埔寨':[104.5444,11.333],
                                '韩国':[128.243504,36.683644],
                                '科索沃':[42.57,21.0],
                                '科威特':[48.014,29.1946],
                                '老挝':[102.3653,17.5746],
                                '黎巴嫩':[35.3048,33.5314],
                                '利比里亚':[-10.47,6.18],
                                '利比亚':[13.11,32.54],
                                '斯里兰卡':[79.5054,6.5539],
                                '莱索托':[27.29,-29.15],
                                '立陶宛':[25.19,54.41],
                                '卢森堡':[6.09,49.36],
                                '拉脱维亚':[56.6,24.1],
                                '摩洛哥':[-6.51,34.02],
                                '摩尔多瓦':[28.5,47],
                                '马达加斯加':[-18.6,47.3],
                                '墨西哥':[-99.75,19.2438],
                                '马其顿':[21.28,42.00],
                                '马里':[145.4522,15.1051],
                                '缅甸':[96.925,16.471],
                                '黑山':[42.78,19.31],
                                '蒙古':[106.542,47.5517],
                                '莫桑比克':[-26.1,32.4],
                                '毛里塔尼亚':[-15.57,18.06],
                                '马拉维':[33.44,-13.59],
                                '马来西亚':[101.4227,3.92],
                                '纳米比亚':[-22.3,17.1],
                                '新喀里多尼亚':[166.27,-22.16],
                                '尼日尔':[2.07,13.31],
                                '尼日利亚':[9.1,7.1],
                                '尼加拉瓜':[-86.1619,12.852],
                                '荷兰':[4.54,52.22],
                                '挪威':[10.45,59.56],
                                '尼泊尔':[85.196,27.421],
                                '新西兰':[174.4657,-41.1858],
                                '阿曼':[58.3528,23.3652],
                                '巴基斯坦':[73.337,33.435],
                                '巴拿马':[-79.318,8.594],
                                '秘鲁':[-77.243,-12.535],
                                '菲律宾':[120.5857,14.362],
                                '巴布亚新几内亚':[-9.3,147.1],
                                '波兰':[21.00,52.15],
                                '波多黎各':[-66.36,18.26],
                                '北朝鲜':[39.0,125.5],
                                '葡萄牙':[-9.08,38.43],
                                '巴拉圭':[-57.3814,-25.181],
                                '卡塔尔':[51.313,25.1655],
                                '罗马尼亚':[26.06,44.26],
                                '俄罗斯':[37.35,55.45],
                                '卢旺达':[30.04,1.57],
                                '西撒哈拉':[-13.12,27.09],
                                '沙特阿拉伯':[24.4,46.4],
                                '苏丹':[15.4,32.3],
                                '南苏丹':[],
                                '塞内加尔':[14.4,-17.3],
                                '所罗门群岛':[159.5724,-9.2552],
                                '塞拉利昂':[-13.15,8.3],
                                '萨尔瓦多':[-89.125,13.4224],
                                '索马里兰':[45,10],
                                '索马里':[45.20,2.01],
                                '塞尔维亚共和国':[44.5,20.3],
                                '苏里南':[-55.1015,5.4924],
                                '斯洛伐克':[17.10,48.10],
                                '斯洛文尼亚':[14.31,46.48],
                                '瑞典':[11.58,57.45],
                                '斯威士兰':[31.06-26.18],
                                '叙利亚':[36.1848,33.319],
                                '乍得':[12.1,15.0],
                                '多哥':[1.21,6.08],
                                '泰国':[13.5,100.3],
                                '塔吉克斯坦':[38.4,68.5],
                                '土库曼斯坦':[39.1,58.2],
                                '东帝汶':[125.3447,8.3334],
                                '特里尼达和多巴哥':[-61.31,10.39],
                                '突尼斯':[10.11,36.48],
                                '土耳其':[32.5112,39.5545],
                                '坦桑尼亚联合共和国':[39.17,6.48],
                                '乌干达':[0.2,32.3],
                                '乌克兰':[46.3,30.4],
                                '乌拉圭':[-56.925,-34.5338],
                                '美国':[-77.033,38.5324],
                                '乌兹别克斯坦':[41.2,69.2],
                                '委内瑞拉':[-66.546,10.2928],
                                '越南':[105.5117,21.127],
                                '瓦努阿图':[168.1915,-17.4425],
                                '西岸':[],
                                '也门':[44.1226,15.217],
                                '南非':[18.28,-35.56],
                                '赞比亚':[-15.3,28.2],
                                '津巴布韦':[-17.5,31.0]
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
                if( years[i] === ( ''+year) ){
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
        
        // 为echarts对象加载数据 
        chart_.setOption(option, true); 
    }


    //指数类别切换按钮事件
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
            updateMap( myChart, _data, txt, index_ );
        }
    }

     //左侧栏关闭按钮点击事件
    var rank_close = $('.right');
    rank_close.on('click', function(event) {
        $(this).parent().removeClass('rank_content_right');
        $(this).parent().children('.rank_content').children().remove();
        option.options[0].series[0].markPoint.data = [];
        myChart.clear();
        myChart.setOption( option, true );
    });
})(jQuery);