'use strict'

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })



async function run () {
    //await client.indices.delete({index:"game-of-thrones"});
  const { body: bulkResponse } = await client.bulk({
    refresh: true,
    body: [
      // operation to perform
      { index: { _index: 'game-of-thrones' } },
      // the document to index
      {
        character: 'Ned Stark',
        quote: 'Winter is coming.'
      },

      { index: { _index: 'game-of-thrones' } },
      {
        character: 'Daenerys Targaryen',
        quote: 'I am the blood of the dragon.'
      },

      { index: { _index: 'game-of-thrones' } },
      {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.'
      }
    ]
  })

  if (bulkResponse.errors) {
    console.log(bulkResponse)
    process.exit(1)
  }

  // Let's search!
  const { body } = await client.search({
    index: 'game-of-thrones',
    body: {
      query: {
        match: {
          quote: 'winter'
        }
      }
    }
  }, {
    asStream: true
  })


  // stream async iteration, available in Node.js ≥ 10
  var payload = ''
  body.setEncoding('utf8')
  for await (const chunk of body) {
    payload += chunk
  }
  console.log((JSON.parse(payload)).hits.hits)

  
}

run().catch(console.log)



/*



*/