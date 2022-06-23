import request from 'request'
import cheerio from 'cheerio'

const url = "http://web.archive.org/web/20210302035737/https://www.2kratings.com/trae-young"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function proxyGenerator() {
    let ip_addresses: string[] = [];
    let port_numbers: string[] = [];
    let proxy: string;
  
    request("https://sslproxies.org/", function(error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
  
        $("td:nth-child(1)").each(function(index, value) {
          ip_addresses[index] = $(this).text();
        });
  
        $("td:nth-child(2)").each(function(index, value) {
          port_numbers[index] = $(this).text();
        });
      } else {
        console.log("Error loading proxy, please try again");
      }
  
      ip_addresses.join(", ");
      port_numbers.join(", ");
    })

    let random_number = Math.floor(Math.random() * 100);
    console.log(ip_addresses[random_number]);
    console.log(port_numbers[random_number]);
}



const getTeams = (url: string) => {
    let teams: string[] = []
    request(url, (error, response, html) => {
        const $ = cheerio.load(html)
        $('a').each((index, value) => {
            let link = $(value).attr('href')
            if(link !== undefined && link.includes('/teams/')) {
                    // teams.push(link)
                    console.log(link)
            }
        })
    })
}

const getPlayers = async (url: string) => {
    let players: string[] = []
    request(url, (error, response, html) => {
        const $ = cheerio.load(html)
        $('span.entry-font').each((index, value) => {
            value.children.forEach((element) => {
                let link = $(element).attr('href')
                if(link !== undefined && !link.includes('/teams')) {
                    players.push(link)
                }
            })
        })
    })

    let promises: any = []
    players.forEach(async (player) => {
        await getPlayer(player)
    })

}

const getPlayer = async (url: string) => {

    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
        }
    }
    request(options, async (error, response, html) => {
        const $ = cheerio.load(html)
        const overalls: string = $('span.attribute-box').text()
        const overall: string = $('span.attribute-box-player').text()
        let name: string = $('h1.header-title').text()
        name = name.substring(1, name.length)
        let team = $('div.header-subtitle').text()
        team = team.substring(team.indexOf('Team: ') + 6, team.indexOf('Archetype:'))
        const data = {
            name: name,
            team: team,
            overall: parseInt(overall, 10),
            outside: parseInt(overalls.substring(0, 2), 10),
            inside: parseInt(overalls.substring(30, 32), 10), 
            defending:parseInt(overalls.substring(60, 62), 10), 
            athleticism: parseInt(overalls.substring(14, 16), 10), 
            playmaking: parseInt(overalls.substring(48, 50), 10),
            rebounding: parseInt(overalls.substring(78, 80), 10),
            total: parseInt(overalls.substring(90, 94), 10),
            closeShot: parseInt(overalls.substring(2, 4), 10),
            midRangeShot: parseInt(overalls.substring(4, 6), 10), 
            threePointShot: parseInt(overalls.substring(6, 8), 10), 
            freeThrow: parseInt(overalls.substring(8, 10), 10),
            shotIQ: parseInt(overalls.substring(10, 12), 10),
            offensiveConsistency: parseInt(overalls.substring(12, 14), 10),
            layup:parseInt(overalls.substring(32, 34), 10), 
            standingDunk:parseInt(overalls.substring(34, 36), 10), 
            drivingDunk:parseInt(overalls.substring(36, 38), 10), 
            postHook:parseInt(overalls.substring(38, 40), 10), 
            postFade:parseInt(overalls.substring(40, 42), 10), 
            postControl:parseInt(overalls.substring(42, 44), 10), 
            drawFoul:parseInt(overalls.substring(44, 46), 10), 
            hands:parseInt(overalls.substring(46, 48), 10), 
            interiorDefense:parseInt(overalls.substring(62, 64), 10),
            perimeterDefense: parseInt(overalls.substring(64, 66), 10), 
            steal: parseInt(overalls.substring(66, 68), 10),
            block:parseInt(overalls.substring(68, 70), 10),
            lateralQuickness: parseInt(overalls.substring(70, 72), 10), 
            helpDefenseIQ: parseInt(overalls.substring(72, 74), 10),
            passPerception: parseInt(overalls.substring(74, 76), 10), 
            defensiveConsistency: parseInt(overalls.substring(76, 78), 10), 
            speed:parseInt(overalls.substring(16, 18), 10),
            acceleration:parseInt(overalls.substring(18, 20), 10),
            strength:parseInt(overalls.substring(20, 22), 10),
            vertical:parseInt(overalls.substring(22, 24), 10),
            stamina:parseInt(overalls.substring(24, 26), 10),
            hustle:parseInt(overalls.substring(26, 28), 10),
            overallDurability:parseInt(overalls.substring(28, 30), 10),
            passAccuracy:parseInt(overalls.substring(50, 52), 10),
            ballHandle:parseInt(overalls.substring(52, 54), 10),
            speedWithBall:parseInt(overalls.substring(54, 56), 10), 
            passIQ:parseInt(overalls.substring(56, 58), 10),
            passVision:parseInt(overalls.substring(58, 60), 10), 
            offensiveRebound:parseInt(overalls.substring(80, 82), 10), 
            defensiveRebound:parseInt(overalls.substring(82, 84), 10),
        }
    
        await prisma.player.create({
            data
        })
    })
}

proxyGenerator()
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/atlanta-hawks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/boston-celtics")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/brooklyn-nets")

// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/charlotte-hornets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/cleveland-cavaliers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/dallas-mavericks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/denver-nuggets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/detroit-pistons")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/golden-state-warriors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/houston-rockets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/indiana-pacers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/los-angeles-clippers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/memphis-grizzlies")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/miami-heat")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/milwaukee-bucks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/minnesota-timberwolves")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/new-orleans-pelicans")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/new-york-knicks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/oklahoma-city-thunder")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/orlando-magic")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/philadelphia-76ers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/phoenix-suns")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/portland-trail-blazers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/sacramento-kings")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/san-antonio-spurs")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/toronto-raptors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/utah-jazz")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/washington-wizards")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1976-77-philadelphia-76ers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2000-01-philadelphia-76ers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1970-71-milwaukee-bucks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1984-85-milwaukee-bucks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1985-86-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1988-89-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1990-91-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1992-93-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1995-96-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1997-98-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2010-11-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1989-90-cleveland-cavaliers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2006-07-cleveland-cavaliers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2015-16-cleveland-cavaliers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1964-65-boston-celtics")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1985-86-boston-celtics")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2007-08-boston-celtics")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2013-14-los-angeles-clippers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2005-06-memphis-grizzlies")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2012-13-memphis-grizzlies")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1985-86-atlanta-hawks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1996-97-miami-heat")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2005-06-miami-heat")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2012-13-miami-heat")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1992-93-charlotte-hornets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1997-98-utah-jazz")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2001-02-sacramento-kings")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1971-72-new-york-knicks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1994-95-new-york-knicks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1998-99-new-york-knicks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2011-12-new-york-knicks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1964-65-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1970-71-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1986-87-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1990-91-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1997-98-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2000-01-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2003-04-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1994-95-orlando-magic")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2002-03-dallas-mavericks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2010-11-dallas-mavericks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2001-02-new-jersey-nets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1993-94-denver-nuggets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2007-08-denver-nuggets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2013-14-indiana-pacers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1988-89-detroit-pistons")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2003-04-detroit-pistons")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1999-00-toronto-raptors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2018-19-toronto-raptors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1993-94-houston-rockets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2007-08-houston-rockets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1990-91-portland-trail-blazers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1999-00-portland-trail-blazers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2009-10-portland-trail-blazers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1997-98-san-antonio-spurs")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2004-05-san-antonio-spurs")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2013-14-san-antonio-spurs")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2002-03-phoenix-suns")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2004-05-phoenix-suns")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1995-96-seattle-supersonics")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2011-12-oklahoma-city-thunder")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2003-04-minnesota-timberwolves")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/1990-91-golden-state-warriors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2006-07-golden-state-warriors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2015-16-golden-state-warriors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2016-17-golden-state-warriors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/2006-07-washington-wizards")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-philadelphia-76ers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-milwaukee-bucks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-chicago-bulls")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-cleveland-cavaliers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-boston-celtics")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-los-angeles-clippers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-memphis-grizzlies")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-atlanta-hawks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-miami-heat")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-charlotte-hornets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-utah-jazz")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-sacramento-kings")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-new-york-knicks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-los-angeles-lakers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-orlando-magic")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-dallas-mavericks")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-brooklyn-nets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-denver-nuggets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-indiana-pacers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-new-orleans-pelicans")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-detroit-pistons")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-toronto-raptors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-houston-rockets")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-san-antonio-spurs")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-phoenix-suns")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-oklahoma-city-thunder")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-minnesota-timberwolves")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-portland-trail-blazers")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-golden-state-warriors")
// getPlayers("http://web.archive.org/web/20210226013604/https://www.2kratings.com/teams/all-time-washington-wizards")