const test = require('tape')
const { cheerio, ehp, highlight, leven, ngraminator, sw, wnn } = require('../index.js')
const $ = cheerio.load(require('./test-data.js')) // Example grabbed from view-source:https://www.bbc.com/news/world-middle-east-49782693

test('extract strings from html, arrays from strings, remove stopwords, make ngrams, find keywords ', function (t) {
  t.plan(11)

  // Extracting title with Cheerio selectors
  const headlineString = $('h1').text()
  t.deepEqual(headlineString, 'Saudi Arabia vows to respond to oil attacks with \'necessary measures\'')

  // Extracting the first 2501 characters from bodytext / story, only paragraphs
  const bodyString = $('.story-body__inner p').text().substring(0, 2501)
  t.deepEqual(bodyString, 'Saudi Arabia says it will respond with "necessary measures" to attacks on two oil facilities as it reiterated the accusation that Iran was behind them.Minister of State for Foreign Affairs Adel al-Jubeir said the weapons used were Iranian and vowed to release the full findings of the investigation.Iran denies involvement in the attacks.Earlier, a senior Iranian military official said Iran was ready to destroy any aggressor after the US announced it was sending troops to Saudi Arabia.Iranian-backed Houthi rebels in Yemen have said they were responsible for the drone and missile strikes on 14 September that affected the global oil supply.Tensions between the US and Iran have escalated since US President Donald Trump abandoned a deal limiting Iran\'s nuclear activities last year and reinstated sanctions.Speaking to reporters in Riyadh, Mr Jubeir said Saudi Arabia was in consultation with its allies and would take necessary and suitable measures after its investigation was complete, without giving details of possible actions. He repeated that the strikes targeting the Abqaiq oil facility and the Khurais oil field had come from the north and not from Yemen but did not give a specific location, and urged the international community to take a stand."The kingdom calls upon the international community to assume its responsibility in condemning those that stand behind this act, and to take a firm and clear position against this reckless behaviour that threatens the global economy," he said.The Saudi defence ministry showed off on Wednesday what it said were the remains of drones and cruise missiles proving Iranian involvement.The US has also accused Iran of being behind the attacks, and unnamed senior officials have told US media that the evidence suggests the strikes originated in the south of Iran.On Friday, Secretary of Defence Mark Esper said the US would send a yet-to-be-decided number of troops to Saudi Arabia to boost the country\'s air and missile defences.President Trump then announced new sanctions against Iran, focusing on the country\'s central bank and its sovereign wealth fund, while signalling that he wanted to avoid military conflict.The news conference in the glittering halls of Saudi Arabia\'s foreign ministry was fairly predictable in its customary condemnation of Iran.The Islamic Republic, said the eloquent and softly-spoken minister of state for foreign affairs, was to blame for all the mischief-making in the region, including more than 260 ballistic')

  // Extract array of words from title / headline
  const headlineArray = wnn.extract(headlineString, { regex: wnn.wordsAndNumbers, toLowercase: true })
  t.deepEqual(headlineArray, ['saudi', 'arabia', 'vows', 'to', 'respond', 'to', 'oil', 'attacks', 'with', 'necessary', 'measures'])

  // Extract array of words from bodytext / story
  const bodyArray = wnn.extract(bodyString, { regex: wnn.wordsAndNumbers, toLowercase: true })
  t.deepEqual(bodyArray, ['saudi', 'arabia', 'says', 'it', 'will', 'respond', 'with', 'necessary', 'measures', 'to', 'attacks', 'on', 'two', 'oil', 'facilities', 'as', 'it', 'reiterated', 'the', 'accusation', 'that', 'iran', 'was', 'behind', 'them', 'minister', 'of', 'state', 'for', 'foreign', 'affairs', 'adel', 'al', 'jubeir', 'said', 'the', 'weapons', 'used', 'were', 'iranian', 'and', 'vowed', 'to', 'release', 'the', 'full', 'findings', 'of', 'the', 'investigation', 'iran', 'denies', 'involvement', 'in', 'the', 'attacks', 'earlier', 'a', 'senior', 'iranian', 'military', 'official', 'said', 'iran', 'was', 'ready', 'to', 'destroy', 'any', 'aggressor', 'after', 'the', 'us', 'announced', 'it', 'was', 'sending', 'troops', 'to', 'saudi', 'arabia', 'iranian', 'backed', 'houthi', 'rebels', 'in', 'yemen', 'have', 'said', 'they', 'were', 'responsible', 'for', 'the', 'drone', 'and', 'missile', 'strikes', 'on', '14', 'september', 'that', 'affected', 'the', 'global', 'oil', 'supply', 'tensions', 'between', 'the', 'us', 'and', 'iran', 'have', 'escalated', 'since', 'us', 'president', 'donald', 'trump', 'abandoned', 'a', 'deal', 'limiting', 'iran', 's', 'nuclear', 'activities', 'last', 'year', 'and', 'reinstated', 'sanctions', 'speaking', 'to', 'reporters', 'in', 'riyadh', 'mr', 'jubeir', 'said', 'saudi', 'arabia', 'was', 'in', 'consultation', 'with', 'its', 'allies', 'and', 'would', 'take', 'necessary', 'and', 'suitable', 'measures', 'after', 'its', 'investigation', 'was', 'complete', 'without', 'giving', 'details', 'of', 'possible', 'actions', 'he', 'repeated', 'that', 'the', 'strikes', 'targeting', 'the', 'abqaiq', 'oil', 'facility', 'and', 'the', 'khurais', 'oil', 'field', 'had', 'come', 'from', 'the', 'north', 'and', 'not', 'from', 'yemen', 'but', 'did', 'not', 'give', 'a', 'specific', 'location', 'and', 'urged', 'the', 'international', 'community', 'to', 'take', 'a', 'stand', 'the', 'kingdom', 'calls', 'upon', 'the', 'international', 'community', 'to', 'assume', 'its', 'responsibility', 'in', 'condemning', 'those', 'that', 'stand', 'behind', 'this', 'act', 'and', 'to', 'take', 'a', 'firm', 'and', 'clear', 'position', 'against', 'this', 'reckless', 'behaviour', 'that', 'threatens', 'the', 'global', 'economy', 'he', 'said', 'the', 'saudi', 'defence', 'ministry', 'showed', 'off', 'on', 'wednesday', 'what', 'it', 'said', 'were', 'the', 'remains', 'of', 'drones', 'and', 'cruise', 'missiles', 'proving', 'iranian', 'involvement', 'the', 'us', 'has', 'also', 'accused', 'iran', 'of', 'being', 'behind', 'the', 'attacks', 'and', 'unnamed', 'senior', 'officials', 'have', 'told', 'us', 'media', 'that', 'the', 'evidence', 'suggests', 'the', 'strikes', 'originated', 'in', 'the', 'south', 'of', 'iran', 'on', 'friday', 'secretary', 'of', 'defence', 'mark', 'esper', 'said', 'the', 'us', 'would', 'send', 'a', 'yet', 'to', 'be', 'decided', 'number', 'of', 'troops', 'to', 'saudi', 'arabia', 'to', 'boost', 'the', 'country', 's', 'air', 'and', 'missile', 'defences', 'president', 'trump', 'then', 'announced', 'new', 'sanctions', 'against', 'iran', 'focusing', 'on', 'the', 'country', 's', 'central', 'bank', 'and', 'its', 'sovereign', 'wealth', 'fund', 'while', 'signalling', 'that', 'he', 'wanted', 'to', 'avoid', 'military', 'conflict', 'the', 'news', 'conference', 'in', 'the', 'glittering', 'halls', 'of', 'saudi', 'arabia', 's', 'foreign', 'ministry', 'was', 'fairly', 'predictable', 'in', 'its', 'customary', 'condemnation', 'of', 'iran', 'the', 'islamic', 'republic', 'said', 'the', 'eloquent', 'and', 'softly', 'spoken', 'minister', 'of', 'state', 'for', 'foreign', 'affairs', 'was', 'to', 'blame', 'for', 'all', 'the', 'mischief', 'making', 'in', 'the', 'region', 'including', 'more', 'than', '260', 'ballistic'])

  // Remove stopwords from title / headline
  const headlineStopped = sw.removeStopwords(headlineArray)
  t.deepEqual(headlineStopped, ['saudi', 'arabia', 'vows', 'respond', 'oil', 'attacks', 'necessary', 'measures'])

  // Remove stopwords from bodytext / story
  const bodyStopped = sw.removeStopwords(bodyArray)
  t.deepEqual(bodyStopped, ['saudi', 'arabia', 'says', 'will', 'respond', 'necessary', 'measures', 'attacks', 'two', 'oil', 'facilities', 'reiterated', 'accusation', 'iran', 'behind', 'minister', 'state', 'foreign', 'affairs', 'adel', 'al', 'jubeir', 'weapons', 'used', 'iranian', 'vowed', 'release', 'full', 'findings', 'investigation', 'iran', 'denies', 'involvement', 'attacks', 'earlier', 'senior', 'iranian', 'military', 'official', 'iran', 'ready', 'destroy', 'aggressor', 'us', 'announced', 'sending', 'troops', 'saudi', 'arabia', 'iranian', 'backed', 'houthi', 'rebels', 'yemen', 'responsible', 'drone', 'missile', 'strikes', '14', 'september', 'affected', 'global', 'oil', 'supply', 'tensions', 'us', 'iran', 'escalated', 'us', 'president', 'donald', 'trump', 'abandoned', 'deal', 'limiting', 'iran', 's', 'nuclear', 'activities', 'last', 'year', 'reinstated', 'sanctions', 'speaking', 'reporters', 'riyadh', 'mr', 'jubeir', 'saudi', 'arabia', 'consultation', 'its', 'allies', 'necessary', 'suitable', 'measures', 'its', 'investigation', 'complete', 'without', 'giving', 'details', 'possible', 'actions', 'repeated', 'strikes', 'targeting', 'abqaiq', 'oil', 'facility', 'khurais', 'oil', 'field', 'north', 'not', 'yemen', 'not', 'give', 'specific', 'location', 'urged', 'international', 'community', 'stand', 'kingdom', 'calls', 'upon', 'international', 'community', 'assume', 'its', 'responsibility', 'condemning', 'stand', 'behind', 'act', 'firm', 'clear', 'position', 'against', 'reckless', 'behaviour', 'threatens', 'global', 'economy', 'saudi', 'defence', 'ministry', 'showed', 'off', 'wednesday', 'remains', 'drones', 'cruise', 'missiles', 'proving', 'iranian', 'involvement', 'us', 'accused', 'iran', 'behind', 'attacks', 'unnamed', 'senior', 'officials', 'told', 'us', 'media', 'evidence', 'suggests', 'strikes', 'originated', 'south', 'iran', 'friday', 'secretary', 'defence', 'mark', 'esper', 'us', 'send', 'yet', 'decided', 'number', 'troops', 'saudi', 'arabia', 'boost', 'country', 's', 'air', 'missile', 'defences', 'president', 'trump', 'announced', 'new', 'sanctions', 'against', 'iran', 'focusing', 'country', 's', 'central', 'bank', 'its', 'sovereign', 'wealth', 'fund', 'signalling', 'wanted', 'avoid', 'military', 'conflict', 'news', 'conference', 'glittering', 'halls', 'saudi', 'arabia', 's', 'foreign', 'ministry', 'fairly', 'predictable', 'its', 'customary', 'condemnation', 'iran', 'islamic', 'republic', 'eloquent', 'softly', 'spoken', 'minister', 'state', 'foreign', 'affairs', 'blame', 'mischief', 'making', 'region', 'including', '260', 'ballistic'])

  // Calculate n-grams (2-grams, 3-grams and 4-grams) from title / headline
  const headlineNgrams = ngraminator(headlineStopped, [2, 3, 4])
  t.deepEqual(headlineNgrams, [['arabia', 'vows'], ['arabia', 'vows', 'respond'], ['arabia', 'vows', 'respond', 'oil'], ['attacks', 'necessary'], ['attacks', 'necessary', 'measures'], ['necessary', 'measures'], ['oil', 'attacks'], ['oil', 'attacks', 'necessary'], ['oil', 'attacks', 'necessary', 'measures'], ['respond', 'oil'], ['respond', 'oil', 'attacks'], ['respond', 'oil', 'attacks', 'necessary'], ['saudi', 'arabia'], ['saudi', 'arabia', 'vows'], ['saudi', 'arabia', 'vows', 'respond'], ['vows', 'respond'], ['vows', 'respond', 'oil'], ['vows', 'respond', 'oil', 'attacks']])

  // Calculate n-grams (3-grams) from bodytext / story
  const bodyNgrams = ngraminator(bodyStopped, [3])
  t.deepEqual(bodyNgrams, [['14', 'september', 'affected'], ['abandoned', 'deal', 'limiting'], ['abqaiq', 'oil', 'facility'], ['accusation', 'iran', 'behind'], ['accused', 'iran', 'behind'], ['act', 'firm', 'clear'], ['actions', 'repeated', 'strikes'], ['activities', 'last', 'year'], ['adel', 'al', 'jubeir'], ['affairs', 'adel', 'al'], ['affairs', 'blame', 'mischief'], ['affected', 'global', 'oil'], ['against', 'iran', 'focusing'], ['against', 'reckless', 'behaviour'], ['aggressor', 'us', 'announced'], ['air', 'missile', 'defences'], ['al', 'jubeir', 'weapons'], ['allies', 'necessary', 'suitable'], ['announced', 'new', 'sanctions'], ['announced', 'sending', 'troops'], ['arabia', 'boost', 'country'], ['arabia', 'consultation', 'its'], ['arabia', 'iranian', 'backed'], ['arabia', 's', 'foreign'], ['arabia', 'says', 'will'], ['assume', 'its', 'responsibility'], ['attacks', 'earlier', 'senior'], ['attacks', 'two', 'oil'], ['attacks', 'unnamed', 'senior'], ['avoid', 'military', 'conflict'], ['backed', 'houthi', 'rebels'], ['bank', 'its', 'sovereign'], ['behaviour', 'threatens', 'global'], ['behind', 'act', 'firm'], ['behind', 'attacks', 'unnamed'], ['behind', 'minister', 'state'], ['blame', 'mischief', 'making'], ['boost', 'country', 's'], ['calls', 'upon', 'international'], ['central', 'bank', 'its'], ['clear', 'position', 'against'], ['community', 'assume', 'its'], ['community', 'stand', 'kingdom'], ['complete', 'without', 'giving'], ['condemnation', 'iran', 'islamic'], ['condemning', 'stand', 'behind'], ['conference', 'glittering', 'halls'], ['conflict', 'news', 'conference'], ['consultation', 'its', 'allies'], ['country', 's', 'air'], ['country', 's', 'central'], ['cruise', 'missiles', 'proving'], ['customary', 'condemnation', 'iran'], ['deal', 'limiting', 'iran'], ['decided', 'number', 'troops'], ['defence', 'mark', 'esper'], ['defence', 'ministry', 'showed'], ['defences', 'president', 'trump'], ['denies', 'involvement', 'attacks'], ['destroy', 'aggressor', 'us'], ['details', 'possible', 'actions'], ['donald', 'trump', 'abandoned'], ['drone', 'missile', 'strikes'], ['drones', 'cruise', 'missiles'], ['earlier', 'senior', 'iranian'], ['economy', 'saudi', 'defence'], ['eloquent', 'softly', 'spoken'], ['escalated', 'us', 'president'], ['esper', 'us', 'send'], ['evidence', 'suggests', 'strikes'], ['facilities', 'reiterated', 'accusation'], ['facility', 'khurais', 'oil'], ['fairly', 'predictable', 'its'], ['field', 'north', 'not'], ['findings', 'investigation', 'iran'], ['firm', 'clear', 'position'], ['focusing', 'country', 's'], ['foreign', 'affairs', 'adel'], ['foreign', 'affairs', 'blame'], ['foreign', 'ministry', 'fairly'], ['friday', 'secretary', 'defence'], ['full', 'findings', 'investigation'], ['fund', 'signalling', 'wanted'], ['give', 'specific', 'location'], ['giving', 'details', 'possible'], ['glittering', 'halls', 'saudi'], ['global', 'economy', 'saudi'], ['global', 'oil', 'supply'], ['halls', 'saudi', 'arabia'], ['houthi', 'rebels', 'yemen'], ['including', '260', 'ballistic'], ['international', 'community', 'assume'], ['international', 'community', 'stand'], ['investigation', 'complete', 'without'], ['investigation', 'iran', 'denies'], ['involvement', 'attacks', 'earlier'], ['involvement', 'us', 'accused'], ['iran', 'behind', 'attacks'], ['iran', 'behind', 'minister'], ['iran', 'denies', 'involvement'], ['iran', 'escalated', 'us'], ['iran', 'focusing', 'country'], ['iran', 'friday', 'secretary'], ['iran', 'islamic', 'republic'], ['iran', 'ready', 'destroy'], ['iran', 's', 'nuclear'], ['iranian', 'backed', 'houthi'], ['iranian', 'involvement', 'us'], ['iranian', 'military', 'official'], ['iranian', 'vowed', 'release'], ['islamic', 'republic', 'eloquent'], ['its', 'allies', 'necessary'], ['its', 'customary', 'condemnation'], ['its', 'investigation', 'complete'], ['its', 'responsibility', 'condemning'], ['its', 'sovereign', 'wealth'], ['jubeir', 'saudi', 'arabia'], ['jubeir', 'weapons', 'used'], ['khurais', 'oil', 'field'], ['kingdom', 'calls', 'upon'], ['last', 'year', 'reinstated'], ['limiting', 'iran', 's'], ['location', 'urged', 'international'], ['making', 'region', 'including'], ['mark', 'esper', 'us'], ['measures', 'attacks', 'two'], ['measures', 'its', 'investigation'], ['media', 'evidence', 'suggests'], ['military', 'conflict', 'news'], ['military', 'official', 'iran'], ['minister', 'state', 'foreign'], ['minister', 'state', 'foreign'], ['ministry', 'fairly', 'predictable'], ['ministry', 'showed', 'off'], ['mischief', 'making', 'region'], ['missile', 'defences', 'president'], ['missile', 'strikes', '14'], ['missiles', 'proving', 'iranian'], ['mr', 'jubeir', 'saudi'], ['necessary', 'measures', 'attacks'], ['necessary', 'suitable', 'measures'], ['new', 'sanctions', 'against'], ['news', 'conference', 'glittering'], ['north', 'not', 'yemen'], ['not', 'give', 'specific'], ['not', 'yemen', 'not'], ['nuclear', 'activities', 'last'], ['number', 'troops', 'saudi'], ['off', 'wednesday', 'remains'], ['official', 'iran', 'ready'], ['officials', 'told', 'us'], ['oil', 'facilities', 'reiterated'], ['oil', 'facility', 'khurais'], ['oil', 'field', 'north'], ['oil', 'supply', 'tensions'], ['originated', 'south', 'iran'], ['position', 'against', 'reckless'], ['possible', 'actions', 'repeated'], ['predictable', 'its', 'customary'], ['president', 'donald', 'trump'], ['president', 'trump', 'announced'], ['proving', 'iranian', 'involvement'], ['ready', 'destroy', 'aggressor'], ['rebels', 'yemen', 'responsible'], ['reckless', 'behaviour', 'threatens'], ['region', 'including', '260'], ['reinstated', 'sanctions', 'speaking'], ['reiterated', 'accusation', 'iran'], ['release', 'full', 'findings'], ['remains', 'drones', 'cruise'], ['repeated', 'strikes', 'targeting'], ['reporters', 'riyadh', 'mr'], ['republic', 'eloquent', 'softly'], ['respond', 'necessary', 'measures'], ['responsibility', 'condemning', 'stand'], ['responsible', 'drone', 'missile'], ['riyadh', 'mr', 'jubeir'], ['s', 'air', 'missile'], ['s', 'central', 'bank'], ['s', 'foreign', 'ministry'], ['s', 'nuclear', 'activities'], ['sanctions', 'against', 'iran'], ['sanctions', 'speaking', 'reporters'], ['saudi', 'arabia', 'boost'], ['saudi', 'arabia', 'consultation'], ['saudi', 'arabia', 'iranian'], ['saudi', 'arabia', 's'], ['saudi', 'arabia', 'says'], ['saudi', 'defence', 'ministry'], ['says', 'will', 'respond'], ['secretary', 'defence', 'mark'], ['send', 'yet', 'decided'], ['sending', 'troops', 'saudi'], ['senior', 'iranian', 'military'], ['senior', 'officials', 'told'], ['september', 'affected', 'global'], ['showed', 'off', 'wednesday'], ['signalling', 'wanted', 'avoid'], ['softly', 'spoken', 'minister'], ['south', 'iran', 'friday'], ['sovereign', 'wealth', 'fund'], ['speaking', 'reporters', 'riyadh'], ['specific', 'location', 'urged'], ['spoken', 'minister', 'state'], ['stand', 'behind', 'act'], ['stand', 'kingdom', 'calls'], ['state', 'foreign', 'affairs'], ['state', 'foreign', 'affairs'], ['strikes', '14', 'september'], ['strikes', 'originated', 'south'], ['strikes', 'targeting', 'abqaiq'], ['suggests', 'strikes', 'originated'], ['suitable', 'measures', 'its'], ['supply', 'tensions', 'us'], ['targeting', 'abqaiq', 'oil'], ['tensions', 'us', 'iran'], ['threatens', 'global', 'economy'], ['told', 'us', 'media'], ['troops', 'saudi', 'arabia'], ['troops', 'saudi', 'arabia'], ['trump', 'abandoned', 'deal'], ['trump', 'announced', 'new'], ['two', 'oil', 'facilities'], ['unnamed', 'senior', 'officials'], ['upon', 'international', 'community'], ['urged', 'international', 'community'], ['us', 'accused', 'iran'], ['us', 'announced', 'sending'], ['us', 'iran', 'escalated'], ['us', 'media', 'evidence'], ['us', 'president', 'donald'], ['us', 'send', 'yet'], ['used', 'iranian', 'vowed'], ['vowed', 'release', 'full'], ['wanted', 'avoid', 'military'], ['wealth', 'fund', 'signalling'], ['weapons', 'used', 'iranian'], ['wednesday', 'remains', 'drones'], ['will', 'respond', 'necessary'], ['without', 'giving', 'details'], ['year', 'reinstated', 'sanctions'], ['yemen', 'not', 'give'], ['yemen', 'responsible', 'drone'], ['yet', 'decided', 'number']])

  // Calculate keywords in title based on bodytext context
  const keywords = ehp.findKeywords(headlineStopped, bodyStopped, 5)
  t.deepEqual(keywords, ['saudi', 'arabia', 'oil', 'attacks', 'necessary'])

  // Highlight a result item where query words matches
  const query = ['saudi', 'arabia', 'attacks']
  const highlighted = highlight(query, headlineArray)
  t.deepEqual(highlighted, '<span class="hitHighlight">saudi arabia</span> vows to respond to oil <span class="hitHighlight">attacks</span> with necessary measures ')

  // Calculate a Levenshtein distance
  const distance = leven('cat', 'cow')
  t.deepEqual(distance, 2)
})
