const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017/' // MongoDB URL
const projectDB = 'elevate-project'
const formsData = require('./forms.json')

// MongoDB Error Code for Duplicate Key
const DUPLICATE_KEY_ERROR_CODE = 11000

// --- UTILITY FUNCTIONS ---

/**
 * Drops the specified collection, effectively deleting all data.
 * @param {string} collectionName The name of the collection to drop.
 * @param {string} currentDB The name of the database.
 */
async function cleanData(collectionName, currentDB) {
	const client = new MongoClient(url)
	try {
		await client.connect()
		const db = client.db(currentDB)
		const collection = db.collection(collectionName)

		const exists = await collection.findOne({})
		if (exists) {
			await collection.drop()
			console.log(`🗑️ Successfully dropped collection: ${currentDB}.${collectionName}`)
		} else {
			console.log(`ℹ️ Collection ${collectionName} in ${currentDB} does not exist or is empty. Skipping drop.`)
		}
	} catch (error) {
		console.error(`❌ Error dropping collection ${collectionName} in ${currentDB}: ${error.message}`)
	} finally {
		await client.close()
	}
}

/**
 * Inserts data into the specified collection and provides detailed status messages.
 * @param {string} collectionName The name of the collection.
 * @param {Array<Object>} data The array of documents to insert.
 * @param {string} currentDB The name of the database.
 */
async function insertData(collectionName, data, currentDB = projectDB) {
	const client = new MongoClient(url)

	try {
		await client.connect()
		const db = client.db(currentDB)
		const collection = db.collection(collectionName)

		if (!data || data.length === 0) {
			console.log(`ℹ️ No data to insert for ${currentDB}.${collectionName}`)
			return
		}

		console.log(`\n--- Attempting insertion into: ${currentDB}.${collectionName} ---`)

		const results = []
		await Promise.all(
			data.map(async (doc, index) => {
				const tempId = doc._id || doc.name || `(Document Index: ${index})`

				try {
					const result = await collection.insertOne(doc)
					const finalId = result.insertedId || doc._id

					results.push({
						id: finalId,
						status: 'SUCCESS',
						message: `Document successfully created with _id: ${finalId}`,
					})
				} catch (error) {
					if (error.code === DUPLICATE_KEY_ERROR_CODE) {
						results.push({
							id: tempId,
							status: 'DUPLICATE',
							message: `The data with identifier ${tempId} is already present in the DB.`,
						})
					} else {
						results.push({
							id: tempId,
							status: 'FAILURE',
							message: `Error inserting document ${tempId}: ${error.message}`,
						})
					}
				}
			})
		)

		// Print the detailed results
		results.forEach((res) => {
			let message = ''
			if (res.status === 'SUCCESS') {
				message = `✅ SUCCESS: ${res.message}`
			} else if (res.status === 'DUPLICATE') {
				message = `⚠️ DUPLICATE: ${res.message}`
			} else {
				message = `❌ FAILURE: ${res.message}`
			}
			console.log(message)
		})
	} catch (globalError) {
		console.error(`\nFatal error connecting to or operating on the database: ${globalError.message}`)
	} finally {
		await client.close()
	}
}

async function main({ dataToBeInserted }) {
	const collectionsToInsert = [
		{ name: 'forms', data: dataToBeInserted, db: projectDB },
	]

	console.log(`\n=================================================`)
	console.log(`🗑️ Starting CLEANUP for Forms Data Collection...`)
	console.log(`=================================================`)

	for (const item of collectionsToInsert) {
		if (item.data) {
			await cleanData(item.name, item.db)
		}
	}

	console.log(`\n=================================================`)
	console.log(`➕ Starting INSERTION for Forms Data Collection...`)
	console.log(`=================================================`)

	for (const item of collectionsToInsert) {
		if (item.data) {
			const transformedData = item.data.map((doc) => ({
				type: doc.type,
				sub_type: doc.subType,
				subType: doc.subType,
				version: 0,
				data: doc.data,
				tenant_code: 'default',
				tenantId: 'default',
				organization_id: 1,
				orgId: 'default_code',
			}))
			await insertData(item.name, transformedData, item.db)
		}
	}
}

main({ dataToBeInserted: formsData })
	.then(() => {
		console.log('\n=======================================')
		console.log('✅ Forms data population process finished.')
		console.log('=======================================')
	})
	.catch(console.error)
