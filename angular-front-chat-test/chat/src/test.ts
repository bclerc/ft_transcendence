

import requests

const cookies = {
    'uev2.id.xp': 'd79cb42f-2c7e-4957-a289-00f856b09eca',
    'dId': 'c1c004c2-e300-426b-ace3-e38bdc324e23',
    'marketing_vistor_id': '997d4255-fd14-4d24-9287-2a9e7f73d475',
    'jwt-session': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjEzNzI5NDIsImV4cCI6MTY2MTQ1OTM0Mn0.YjjuxAb4-DmRHSy8OSZZ_enLbU81h-_P-K-gp6zXCxI',
    'uev2.id.session': 'da099a0f-1ded-4f82-b4ff-96ab68c1b6a8',
    'uev2.ts.session': '1661448430360',
    'usl_rollout_id': '8b00ea8b-6ebe-4e77-a9f9-205fe7c2a1d4',
    'sid': 'QA.CAESEL_3GOFTnkqNr5bO-IyNwy0Y5Py8mQYiATEqJDFiZmQyNGFkLTA5OGEtNDkxNS1iN2RjLWE2ZmE4NDcyMDkxMTJAWXBhuSv_8-VeNUmwLySbhdvCFXkq0YzaoJfTOy1D5Imct_Q452zflQb8VAQ9zKOiu2mQZ2FVpA3J8BnlCBWVzToBMUINLnViZXJlYXRzLmNvbQ.s7LADgJrTC7jKcxWJGw1BYXhJs9rUM3srmO_tOFOn9U',
    'uev2.loc': '%7B%22address%22%3A%7B%22address1%22%3A%226%20Rue%20Kateb%20Yacine%22%2C%22address2%22%3A%22Saint-Ouen%22%2C%22aptOrSuite%22%3A%22%22%2C%22eaterFormattedAddress%22%3A%226%20Rue%20Kateb%20Yacine%2C%2093400%20Saint-Ouen%2C%20France%22%2C%22subtitle%22%3A%22Saint-Ouen%22%2C%22title%22%3A%226%20Rue%20Kateb%20Yacine%22%2C%22uuid%22%3A%22%22%7D%2C%22latitude%22%3A48.904461%2C%22longitude%22%3A2.323344%2C%22reference%22%3A%22ChIJgR3nVQJv5kcRgvMGJ6buedE%22%2C%22referenceType%22%3A%22google_places%22%2C%22type%22%3A%22google_places%22%2C%22addressComponents%22%3A%7B%22CITY%22%3A%22Saint-Ouen%22%2C%22HOUSE_NUMBER%22%3A%226%22%2C%22COUNTRY_CODE%22%3A%22FR%22%2C%22POSTAL_CODE%22%3A%2293400%22%2C%22FIRST_LEVEL_SUBDIVISION_CODE%22%3A%22IDF%22%2C%22STREET_NAME%22%3A%22Rue%20Kateb%20Yacine%22%7D%2C%22originType%22%3A%22user_autocomplete%22%7D',
    'uev2.do': '73c203c3-4e86-444f-918b-19aeaa81f751',
    '_cc': 'Ae0rFt%2B%2FpIoCS%2Fz6ZZL9IdLO',
    'udi-id': 't8ppyDbmD+/YGi0xsK+nC4F3nPL5VHX3vcwrk8e1/wYht3hV/rI8edD2GakxxVKW2b6PJ6IysiSzpsmyoOuasFBrFkATNlDdKxe2d3SGiubaVTg5O8EcZoX/3tIOcpr0yc2y+8mujiOqFjpXDxiIwqinoFdDyHWDTD7kBxqosjTTztZetyQeMJ2OIN024F5NNphPDFblty4s9ZOdZ7CBhg==O0amTwKjYjUNPe19n0ezrw==B2JeXy80GKxplHUEL/ju2fJ6L1GZauOcUUa1CZZhdOM=',
};

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br',
    # Already added when you pass json=
    # 'Content-Type': 'application/json',
    'x-csrf-token': 'x',
    'Origin': 'https://www.ubereats.com',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Referer': 'https://www.ubereats.com/checkout?mod=checkoutApplyPromo&ps=1',
    # Requests sorts cookies= alphabetically
    # 'Cookie': 'uev2.id.xp=d79cb42f-2c7e-4957-a289-00f856b09eca; dId=c1c004c2-e300-426b-ace3-e38bdc324e23; marketing_vistor_id=997d4255-fd14-4d24-9287-2a9e7f73d475; jwt-session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjEzNzI5NDIsImV4cCI6MTY2MTQ1OTM0Mn0.YjjuxAb4-DmRHSy8OSZZ_enLbU81h-_P-K-gp6zXCxI; uev2.id.session=da099a0f-1ded-4f82-b4ff-96ab68c1b6a8; uev2.ts.session=1661448430360; usl_rollout_id=8b00ea8b-6ebe-4e77-a9f9-205fe7c2a1d4; sid=QA.CAESEL_3GOFTnkqNr5bO-IyNwy0Y5Py8mQYiATEqJDFiZmQyNGFkLTA5OGEtNDkxNS1iN2RjLWE2ZmE4NDcyMDkxMTJAWXBhuSv_8-VeNUmwLySbhdvCFXkq0YzaoJfTOy1D5Imct_Q452zflQb8VAQ9zKOiu2mQZ2FVpA3J8BnlCBWVzToBMUINLnViZXJlYXRzLmNvbQ.s7LADgJrTC7jKcxWJGw1BYXhJs9rUM3srmO_tOFOn9U; uev2.loc=%7B%22address%22%3A%7B%22address1%22%3A%226%20Rue%20Kateb%20Yacine%22%2C%22address2%22%3A%22Saint-Ouen%22%2C%22aptOrSuite%22%3A%22%22%2C%22eaterFormattedAddress%22%3A%226%20Rue%20Kateb%20Yacine%2C%2093400%20Saint-Ouen%2C%20France%22%2C%22subtitle%22%3A%22Saint-Ouen%22%2C%22title%22%3A%226%20Rue%20Kateb%20Yacine%22%2C%22uuid%22%3A%22%22%7D%2C%22latitude%22%3A48.904461%2C%22longitude%22%3A2.323344%2C%22reference%22%3A%22ChIJgR3nVQJv5kcRgvMGJ6buedE%22%2C%22referenceType%22%3A%22google_places%22%2C%22type%22%3A%22google_places%22%2C%22addressComponents%22%3A%7B%22CITY%22%3A%22Saint-Ouen%22%2C%22HOUSE_NUMBER%22%3A%226%22%2C%22COUNTRY_CODE%22%3A%22FR%22%2C%22POSTAL_CODE%22%3A%2293400%22%2C%22FIRST_LEVEL_SUBDIVISION_CODE%22%3A%22IDF%22%2C%22STREET_NAME%22%3A%22Rue%20Kateb%20Yacine%22%7D%2C%22originType%22%3A%22user_autocomplete%22%7D; uev2.do=73c203c3-4e86-444f-918b-19aeaa81f751; _cc=Ae0rFt%2B%2FpIoCS%2Fz6ZZL9IdLO; udi-id=t8ppyDbmD+/YGi0xsK+nC4F3nPL5VHX3vcwrk8e1/wYht3hV/rI8edD2GakxxVKW2b6PJ6IysiSzpsmyoOuasFBrFkATNlDdKxe2d3SGiubaVTg5O8EcZoX/3tIOcpr0yc2y+8mujiOqFjpXDxiIwqinoFdDyHWDTD7kBxqosjTTztZetyQeMJ2OIN024F5NNphPDFblty4s9ZOdZ7CBhg==O0amTwKjYjUNPe19n0ezrw==B2JeXy80GKxplHUEL/ju2fJ6L1GZauOcUUa1CZZhdOM=',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    # Requests doesn't support trailers
    # 'TE': 'trailers',
}

params = {
    'localeCode': 'fr-en',
}

json_data = {
    'code': 'uytyuutyrytrtuiyiuy',
}

response = requests.post('https://www.ubereats.com/api/applyPromoV1', params=params, cookies=cookies, headers=headers, json=json_data)

