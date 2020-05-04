const router = require('express').Router();
const unirest = require('unirest');

const fectch = () => {
    return new Promise( (reject, resolve) => {
        try {
            // https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php
            var reqs = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php");
            reqs.headers({
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "fb567843edmshcfcb2d41286a8b3p1ea704jsn35342300bb54"
            });
            reqs.end( ress => {
                if (ress.error) throw new Error(ress.error);
                const api = ress.body;
                reject(api);
            });
        } catch (error) {
            resolve(error)
        }
    })
}


const  filterAndTop10 = async ( condicion )=> {
    const data = await JSON.parse( await fectch() )
    
    const quitarNullPruebas = data.countries_stat.filter(j => j.tests_per_1m_population !== '0' && j.total_cases_per_1m_population !== '0')
    const quitarNullMuerte = data.countries_stat.filter(j => j.deaths_per_1m_population !== '0' && j.total_cases_per_1m_population !== '0')
    
    const division = []
    
    condicion 
    ?
        quitarNullPruebas.forEach(element => {
           const dataTop10 = {
                pais: element.country_name,
                pruebas: parseFloat((
                        parseFloat(element.tests_per_1m_population.replace(',','')) / parseFloat(element.total_cases_per_1m_population.replace(',','')
                    )).toFixed(2)),
                test: element.tests_per_1m_population,
                total: element.total_cases_per_1m_population
           }
    
           division.push(dataTop10)
        })
    :
        quitarNullMuerte.forEach(element => {
            const dataTop10 = {
                pais: element.country_name,
                pruebas: parseFloat( (parseFloat(element.total_cases_per_1m_population) / parseFloat(element.deaths_per_1m_population)).toFixed(2))
            }
    
            division.push(dataTop10)
        });

    const top10 = await division.sort((a,b)=> {
        return b.pruebas-a.pruebas
    }).slice(0,10)

    return top10
}




router.get('/', async (req, res) => {
    const top10 = await filterAndTop10(true)

    res.render('layouts/list',{top10});
});



router.get('/grafica-pruebas', async (req, res) => {
    try {
        const dataGrafica = await filterAndTop10(true)

        res.status(200).json(dataGrafica)
        
    } catch (error) {
        res.status(502).json({message: error.message})
    }   
})


router.get('/grafica-muertes', async (req, res) => {
    try {
        const dataGrafica = await filterAndTop10(false)

        res.status(200).json(dataGrafica)
        
    } catch (error) {
        res.status(502).json({message: error.message})
    }   
})

module.exports = router;