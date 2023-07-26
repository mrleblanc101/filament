import Chart from 'chart.js/auto'

export default function chart({ cachedData, options, type }) {
    return {
        init: function () {
            this.initChart()

            this.$wire.$on('updateChartData', ({ data }) => {
                chart = this.getChart()
                chart.data = data
                chart.update('resize')
            })

            Alpine.effect(() => {
                Alpine.store('theme')

                this.getChart().destroy()
                this.initChart()
            })

            window
                .matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', () => {
                    if (Alpine.store('theme') !== 'system') {
                        return
                    }

                    this.$nextTick(() => {
                        this.getChart().destroy()
                        this.initChart()
                    })
                })
        },

        initChart: function (data = null) {
            Chart.defaults.animation.duration = 0

            const color = getComputedStyle(
                this.$refs.colorElement,
            ).color

            Chart.defaults.backgroundColor = color
            Chart.defaults.borderColor = color

            Chart.defaults.color = getComputedStyle(
                this.$refs.textColorElement,
            ).color

            Chart.defaults.font.family = getComputedStyle(this.$el).fontFamily

            Chart.defaults.plugins.legend.labels.boxWidth = 12
            Chart.defaults.plugins.legend.position = 'bottom'

            const gridColor = getComputedStyle(
                this.$refs.gridColorElement,
            ).color

            options ??= {}
            options.scales ??= {}
            options.scales.x ??= {}
            options.scales.x.grid ??= {}
            options.scales.x.grid.color ??= gridColor
            options.scales.x.grid.display ??= false
            options.scales.x.grid.drawBorder ??= false
            options.scales.y ??= {}
            options.scales.y.grid ??= {}
            options.scales.y.grid.color ??= gridColor
            options.scales.y.grid.drawBorder ??= false

            return new Chart(this.$refs.canvas, {
                type: type,
                data: data ?? cachedData,
                options: options,
            })
        },

        getChart: function () {
            return Chart.getChart(this.$refs.canvas)
        },
    }
}
