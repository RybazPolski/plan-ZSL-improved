const puppeteer = require("puppeteer");

function replaceWakat(s) {
    var aliases = {}
    aliases["Kubczak W."] = "Kubczak M."
    aliases["Wakat k"] = "Wakat k" //FIXME: może spotted powie 2
    aliases["Wakat-AA_INF"] = "Adamek A."
    aliases["Wakat-AG_AUTO"] = "Grześkowiak A."
    aliases["Wakat-BB_POL"] = "Borowska B."
    aliases["Wakat-BP_INF"] = "Pudełko B."
    aliases["Wakat-DK_ELEKTR"] = "Kopania D."
    aliases["Wakat-DS_INF"] = "Stolarski D."
    aliases["Wakat-EK"] = "Kawczyńska E."
    aliases["Wakat-GG_FOTO"] = "Wakat-GG_FOTO"  //FIXME: może spotted powie
    aliases["Wakat-GT_GEO"] = "Tomczak G." 
    aliases["Wakat-HIS"] = "Gołuch J."
    aliases["Wakat-IK_WF"] = "Kubiak I."
    aliases["Wakat-IZ_MAT"] = "Zientera I."
    aliases["Wakat-J.ANG_INF"] = "Jurczyk Maciuszonek"
    aliases["Wakat-JK_FOTO"] = "Jasiczak K." //FIXME: Do sprawdzenia, spytać 1FT
    aliases["Wakat-JM_ELEKTR"] = "Małecki J."
    aliases["Wakat-JO"] = "Osiński J."
    aliases["Wakat-JW_ELEKTR"] = "Waraczewski J."
    aliases["Wakat-JW_INF"] = "Wabich J."
    aliases["Wakat-MKRA_EDB_WF"] = "Krawczyk M."
    aliases["Wakat-MK_JANG"] = "Kudlińska M."
    aliases["Wakat-MK_WF"] = "Konieczny M."
    aliases["Wakat-REL"] = "Proch J." //FIXME: Podpytać księdza
    aliases["Wakat-UC"] = "Cichocka U."
    aliases["Wakat-WDŻwR"] = "Wakat-WDŻwR"
    return aliases[s]?aliases[s]:s
}

function classroomSort( a, b ) {
    if(a[0]=='0'&&(a.split(" ")[0].length)==2){a='00'+a}else{
        if(a[0]=='0'||(a.split(" ")[0].length)==2){a='0'+a}
    }
    if(b[0]=='0'&&(b.split(" ")[0].length==2)){b='00'+b}else{
        if(b[0]=='0'||b.split(" ")[0].length==2){b='0'+b}
    }

    if ( a < b ){
        return -1;
    }
    if ( a > b ){
        return 1;
    }
    return 0;
}

async function getSchooltableURL(){
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: '',
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto("https://zsl.poznan.pl/");
    
    try{
        await page.waitForSelector(".dropdown-item")
    }catch(e){
        console.log(e)
    }
    
    let url = (await page.$$eval(".dropdown-item", elements => {
        for(el of elements){if(el.innerHTML.includes("Plan lekcji")){return el.href}}}
    ))
        
    browser.close()
    
    return url;
    
}
 
async function getAll(){
    const url = await getSchooltableURL()
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: '',
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url)
    
    try{
        await page.waitForSelector("#plan_kontener")
    }catch(e){
        console.log(e)
    }

    // const pageContent = await page.$$eval("#plan_kontener",elements=>{return elements.map(el=>{return el})})
    const classes = (await page.$$eval(".plan_menu_link", elements => {
        return elements.map(el=>{
            let properties = {}
            properties.id = el.href.slice(-6)
            properties.class = el.innerHTML.slice(2)
            return properties
        })
    }))

    const teachers = (await page.$$eval("td.lekcja small", elements => {
        return [...new Set(elements.map(el=>{
            let s = el.innerHTML
            s = s.slice(s.indexOf("-")+2, s.includes("Wakat")?s.indexOf(". "):s.indexOf(".")+1)
            if(s[s.length-1]==" "){s=s.slice(0,s.length-1)}
            function replaceWakat(s) {
                var aliases = {}
                aliases["Kubczak W."] = "Kubczak M."
                aliases["Wakat k"] = "Wakat k" //FIXME: może spotted powie 2
                aliases["Wakat-AA_INF"] = "Adamek A."
                aliases["Wakat-AG_AUTO"] = "Grześkowiak A."
                aliases["Wakat-BB_POL"] = "Borowska B."
                aliases["Wakat-BP_INF"] = "Pudełko B."
                aliases["Wakat-DK_ELEKTR"] = "Kopania D."
                aliases["Wakat-DS_INF"] = "Stolarski D."
                aliases["Wakat-EK"] = "Kawczyńska E."
                aliases["Wakat-GG_FOTO"] = "Wakat-GG_FOTO"  //FIXME: może spotted powie
                aliases["Wakat-GT_GEO"] = "Tomczak G." 
                aliases["Wakat-HIS"] = "Gołuch J."
                aliases["Wakat-IK_WF"] = "Kubiak I."
                aliases["Wakat-IZ_MAT"] = "Zientera I."
                aliases["Wakat-J.ANG_INF"] = "Jurczyk Maciuszonek"
                aliases["Wakat-JK_FOTO"] = "Jasiczak K." //FIXME: Do sprawdzenia, spytać 1FT
                aliases["Wakat-JM_ELEKTR"] = "Małecki J."
                aliases["Wakat-JO"] = "Osiński J."
                aliases["Wakat-JW_ELEKTR"] = "Waraczewski J."
                aliases["Wakat-JW_INF"] = "Wabich J."
                aliases["Wakat-MKRA_EDB_WF"] = "Krawczyk M."
                aliases["Wakat-MK_JANG"] = "Kudlińska M."
                aliases["Wakat-MK_WF"] = "Konieczny M."
                aliases["Wakat-REL"] = "Proch J." //FIXME: Podpytać księdza
                aliases["Wakat-UC"] = "Cichocka U."
                aliases["Wakat-WDŻwR"] = "Wakat-WDŻwR"
                return aliases[s]?aliases[s]:s
            }
            s = replaceWakat(s)
            return s
        }).sort())]
    }))

    const classrooms = (await page.$$eval("td.lekcja small", elements => {
        return [...new Set(elements.map(el=>{
            let s = el.innerHTML
            s = s.slice(s.indexOf("(")+1, s.indexOf(")"))
            return s
        }).sort(
            ( a, b ) => {
                if(a[0]=='0'&&(a.split(" ")[0].length)==2){a='00'+a}else{
                    if(a[0]=='0'||(a.split(" ")[0].length)==2){a='0'+a}
                }
                if(b[0]=='0'&&(b.split(" ")[0].length==2)){b='00'+b}else{
                    if(b[0]=='0'||b.split(" ")[0].length==2){b='0'+b}
                }
            
                if ( a < b ){
                  return -1;
                }
                if ( a > b ){
                  return 1;
                }
                return 0;
              }
        ))]
    }))

    const table = (await page.$$eval(`.plan_plan`, function (elements){
        return elements.map(el=>{
            let properties = {}
            properties.classId = el.lang.slice(-6)
            properties.lessons = new Array();
            let unit = 1
            for(row of el.querySelectorAll("[class^=plan_kolor]")){
                let day = 1
                for(lesson of row.querySelectorAll(".lekcja")){
                    for(let i = 0; i<lesson.querySelectorAll("strong").length; i++){
                        let props = {}
                        let s
                        props.day=day
                        props.unit=unit
                        props.subject = lesson.querySelectorAll("strong")[i].innerHTML

                        s = lesson.querySelectorAll('small')[i].innerHTML
                        props.classroom = s.slice(s.indexOf("(")+1, s.indexOf(")"))
                        
                        props.group = s.slice(0,s.indexOf("-")-1)

                        s = s.slice(s.indexOf("-")+2, s.includes("Wakat")?s.indexOf(". "):s.indexOf(".")+1)
                        if(s[s.length-1]==" "){s=s.slice(0,s.length-1)}
                        function replaceWakat(s) {
                            var aliases = {}
                            aliases["Kubczak W."] = "Kubczak M."
                            aliases["Wakat k"] = "Wakat k" //FIXME: może spotted powie 2
                            aliases["Wakat-AA_INF"] = "Adamek A."
                            aliases["Wakat-AG_AUTO"] = "Grześkowiak A."
                            aliases["Wakat-BB_POL"] = "Borowska B."
                            aliases["Wakat-BP_INF"] = "Pudełko B."
                            aliases["Wakat-DK_ELEKTR"] = "Kopania D."
                            aliases["Wakat-DS_INF"] = "Stolarski D."
                            aliases["Wakat-EK"] = "Kawczyńska E."
                            aliases["Wakat-GG_FOTO"] = "Wakat-GG_FOTO"  //FIXME: może spotted powie
                            aliases["Wakat-GT_GEO"] = "Tomczak G." 
                            aliases["Wakat-HIS"] = "Gołuch J."
                            aliases["Wakat-IK_WF"] = "Kubiak I."
                            aliases["Wakat-IZ_MAT"] = "Zientera I."
                            aliases["Wakat-J.ANG_INF"] = "Jurczyk Maciuszonek" 
                            aliases["Wakat-JK_FOTO"] = "Jasiczak K." //FIXME: Do sprawdzenia, spytać 1FT
                            aliases["Wakat-JM_ELEKTR"] = "Małecki J."
                            aliases["Wakat-JO"] = "Osiński J."
                            aliases["Wakat-JW_ELEKTR"] = "Waraczewski J."
                            aliases["Wakat-JW_INF"] = "Wabich J."
                            aliases["Wakat-MKRA_EDB_WF"] = "Krawczyk M."
                            aliases["Wakat-MK_JANG"] = "Kudlińska M."
                            aliases["Wakat-MK_WF"] = "Konieczny M."
                            aliases["Wakat-REL"] = "Proch J." //FIXME: Podpytać księdza
                            aliases["Wakat-UC"] = "Cichocka U."
                            aliases["Wakat-WDŻwR"] = "Wakat-WDŻwR"
                            return aliases[s]?aliases[s]:s
                        }
                        s = replaceWakat(s)
                        props.teacher = s
                        properties.lessons.push(props)
                    }
                    day++
                }
                unit++
            }
            return properties
        })
    }))

    browser.close()
    return {
        plan: table,
        klasy: classes,
        sale: classrooms,
        nauczyciele: teachers
    }
}


module.exports = {
    getAll, getSchooltableURL
}