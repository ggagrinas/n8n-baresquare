import {
		IExecuteFunctions,
		IHookFunctions,
		IPollFunctions
} from 'n8n-core';

import {
		IDataObject,
		IHttpRequestOptions,
		INodeExecutionData,
		INodeType,
		INodeTypeDescription
} from 'n8n-workflow';

import {
		OptionsWithUri,
} from 'request';

import moment from 'moment';

export class Baresquare implements INodeType {
		description: INodeTypeDescription = {
				displayName: 'Baresquare',
				name: 'baresquare',
				icon: 'file:baresquare.svg',
				group: ['trigger'],
				version: 1,
				description: 'Consume Baresquare API',
				defaults: {
						name: 'Baresquare',
						color: '#1A82e2',
				},
				inputs: [],
				outputs: ['main'],
				credentials: [
						{
								name: 'baresquareApi',
								required: true,
						},
				],
				polling:true,
				properties: [
						{
							displayName: 'Ticket',
							name: 'ticket',
							type: 'options',
							options: [
								{
									name: 'New Ticket Created',
									value: 'newTicketCreated',
								},
							],
							required: true,
							default: 'newTicketCreated',
							description: 'If new ticket created triggers workflow',
						},
						// {
						// 	displayName: 'Resource',
						// 	name: 'resource',
						// 	type: 'options',
						// 	options: [
						// 		{
						// 			name: 'Contact',
						// 			value: 'contact',
						// 		},
						// 	],
						// 	default: 'contact',
						// 	required: true,
						// 	description: 'Resource to consume',
						// },
						// {
						// 	displayName: 'Operation',
						// 	name: 'operation',
						// 	type: 'options',
						// 	displayOptions: {
						// 		show: {
						// 			resource: [
						// 				'contact',
						// 			],
						// 		},
						// 	},
						// 	options: [
						// 		{
						// 			name: 'Create',
						// 			value: 'create',
						// 			description: 'Create a contact',
						// 		},
						// 	],
						// 	default: 'create',
						// 	description: 'The operation to perform.',
						// },					
					],
		};


	// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	// 		let responseData;
	// 		// const resource = this.getNodeParameter('resource', 0) as string;
	// 		// const operation = this.getNodeParameter('operation', 0) as string;
	// 		const ticket = this.getNodeParameter('ticket',0) as string;
	// 		//Get credentials the user provided for this node
	// 		const credentials = await this.getCredentials('baresquareApi') as IDataObject;
	// 		console.log("Execute function is running!");
	// 		if (ticket === 'newTicketCreated'){
	// 						// get email input
	// 						// const email = this.getNodeParameter('email', 0) as string;
	// 						// get additional fields input
	// 						// const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
	// 						// const data: IDataObject = {
	// 						// 		email,
	// 						// };
	
	// 						// Object.assign(data, additionalFields);
	
	// 						const options: OptionsWithUri = {
	// 								headers: {
	// 										'Accept': 'application/json',
	// 										'Authorization': `Bearer ${credentials.apiKey}`,
	// 								},
	// 								method: 'GET',
	// 								uri: `https://pre-prod.use.baresquare.com/api/p/v2/incidents`,
	// 								json: true,
	// 						};

	// 						console.log("before request");
	// 						responseData = await this.helpers.request(options);
	// 						responseData = responseData.results;
	// 						console.log("after request");
					
					
	// 		}

	// 		const new_items = [];
			
	// 		const data = this.getWorkflowStaticData("node");

	// 		data.ids = data.ids || [];
			
	// 		const items =this.helpers.returnJsonArray(responseData);
	// 		// console.log(responseData[0])
	// 		const dataIDsTemp = data.ids.toString();
	// 		// console.log(dataIDsTemp.includes(responseData[0].id))
	// 		console.log(dataIDsTemp);

	// 		for (let i = items.length - 1; i >= 0; i--) {

	// 			// Check if data is already present
	// 			if (dataIDsTemp.includes(responseData[i].id)) {
	// 				break;
	// 			} else {
			
	// 				// if new data then add it to an array
	// 				new_items.push({
	// 					json: {
	// 						id: items[i].json.id,
	// 						name: items[i].json.account_id,
	// 						email: items[i].json.author_email_address
	// 					},
	// 				});
	// 			}
	// 		}

	// 		data.ids = items.map((item) => item.json.id);

	// 		return [this.helpers.returnJsonArray(new_items)];
	// }

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		let responseData;
		// const resource = this.getNodeParameter('resource', 0) as string;
		// const operation = this.getNodeParameter('operation', 0) as string;
		const ticket = this.getNodeParameter('ticket',0) as string;
		//Get credentials the user provided for this node
		const credentials = await this.getCredentials('baresquareApi') as IDataObject;
		if (ticket === 'newTicketCreated'){
						// get email input
						// const email = this.getNodeParameter('email', 0) as string;
						// get additional fields input
						// const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
						// const data: IDataObject = {
						// 		email,
						// };

						// Object.assign(data, additionalFields);

						const options: OptionsWithUri = {
								headers: {
										'Accept': 'application/json',
										'Authorization': `Bearer ${credentials.apiKey}`,
								},
								method: 'GET',
								uri: `https://pre-prod.use.baresquare.com/api/p/v2/incidents`,
								json: true,
						};

						responseData = await this.helpers.request(options);
						responseData = responseData.results;
				
		}

		// Deduplication here
		const new_items = [];
		
		const data = this.getWorkflowStaticData("node");


		// time management irelevant to deduplication
		const qs: IDataObject = {};
		qs.start_date = data.lastTimeChecked;
		qs.end_date = moment().format();
		console.log("last time checked!")
		console.log(data.lastTimeChecked)
		data.lastTimeChecked = qs.end_date;
		// time management irelevant to deduplication

		data.ids = data.ids || [];
		
		const items =this.helpers.returnJsonArray(responseData);

		const dataIDsTemp = data.ids.toString();

		for (let i = items.length - 1; i >= 0; i--) {

			// Check if data is already present
			if (dataIDsTemp.includes(responseData[i].id)) {
				break;
			} else {
		
				// if new data then add it to an array
				new_items.push({
					json: {
						id: items[i].json.id,
						name: items[i].json.account_id,
						email: items[i].json.author_email_address
					},
				});
			}
		}

		data.ids = items.map((item) => item.json.id);
		if(new_items.length !==0){
			console.log("found new tickets");
		}
		return [this.helpers.returnJsonArray(new_items)];
	}
}