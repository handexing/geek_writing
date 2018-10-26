/**
 * 首页配置js -- handx
 */
function indexConfig() {

	var self = this;

	this.init = function() {

		var myChart = echarts.init(document.getElementById('writing_line'));
		var option = {
			tooltip: {
				trigger: 'axis'
			},
			/*legend: {
				data: ['最高', '最低']
			},*/
			grid: {
				x: '4%',
				x2: '2%',
				y: '5%',
				y2: '5%'
			},
			lineStyle: {
				color: '#1EC38B'
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07', '10-08', '10-09', '10-10', '10-11', '10-12', '10-13', '10-14', '10-16', '10-17', '10-18', '10-19', '10-20']
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}'
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: 'gainsboro'
					}
				}
			},
			series: [{
				name: '字数',
				type: 'line',
				data: [11, 11, 15, 13, 12, 13, 10, 11, 11, 15, 13, 12, 13, 50, 11, 15, 13, 12, 13, 10]
			}]
		};
		window.onresize = myChart.resize;
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);

		$("#test").on("click", function() {
			alert("123");
		});

	}

	self.init();

}