const graficasMuertes = () => {
    return new Promise ( (reject, resolve) => {

        try {
            fetch('http://localhost:3000/grafica-pruebas')
            .then( data => data.json()
            .then( data => {
                 reject(data)
             }))
        } catch (error) {
            resolve(error)
        }
    })
}

const convertiData = ()=> {
    return new Promise ( async (reject, resolve) => {

        try {
            const data = await graficasMuertes()
            const data2020 = []
    
            data.forEach(Element => {
                const data2020Interna = [
                    Element.pais,
                    Element.pruebas
                ]

                data2020.push(data2020Interna)
            })
            console.log(data2020)
            reject(data2020)
        } catch (error) {
            resolve(error)
        }
    })
}

const mostrargrafica = async () => {
    const data1 = await graficasMuertes()


    var dataPrev = {
        2020: await convertiData()
    };
    
    var data = {
        2020: await convertiData()
    };
    
    var countries = [];

    data1.forEach(Element => {
        const datainterna = {
            name: Element.pais,
            flag: Element.pais,
            color: 'rgb(201, 36, 39)'
        }

        countries.push(datainterna)
    })

    console.log(countries)
    
    
    function getData(data) {
        return data.map(function (country, i) {
            return {
                name: country[0],
                y: country[1],
                color: countries[i].color
            };
        });
    }
    
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Total de pruebas por Covid-19 por pais'
        },
        subtitle: {
            text: 'Datos tomados de la API- Source: <a href="https://rapidapi.com/astsiatsko/api/coronavirus-monitor?endpoint=apiendpoint_8dd02754-5bda-40bf-a7d6-5101f4168318">Covid-19</a>'
        },
        plotOptions: {
            series: {
                grouping: false,
                borderWidth: 0
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} medals</b><br/>'
        },
        xAxis: {
            type: 'category',
            max: 9,
            labels: {
                useHTML: true,
                animate: true,
                formatter: function () {
                    var value = this.value,
                        output;
                        
                        countries.forEach(function (country) {
                            if (country.name === value) {
                                output = country.flag;
                        }
                    });
    
                    return '<span><img src="/public/banderas/' + output + '.png" style="width: 40px; height: 40px;"/><br></span>';
                }
            }
        },
        yAxis: [{
            title: {
                text: 'Gold medals'
            },
            showFirstLabel: false
        }],
        series: [{
            color: 'rgb(158, 159, 163)',
            pointPlacement: -0.2,
            linkedTo: 'main',
            data: dataPrev[2020].slice(),
            name: '2020'
        }, {
            name: '2020',
            id: 'main',
            dataSorting: {
                enabled: true,
                matchByName: true
            },
            dataLabels: [{
                enabled: true,
                inside: true,
                style: {
                    fontSize: '16px'
                }
            }],
            data: getData(data[2020]).slice()
        }],
        exporting: {
            allowHTML: true
        }
    });
}

mostrargrafica();

