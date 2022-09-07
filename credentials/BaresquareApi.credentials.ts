import {
		ICredentialType,
		NodePropertyTypes,
} from 'n8n-workflow';

export class BaresquareApi implements ICredentialType {
		name = 'baresquareApi';
		displayName = 'Baresquare API';
		documentationUrl = 'baresquare';
		properties = [
				{
						displayName: 'API Key',
						name: 'apiKey',
						type: 'string' as NodePropertyTypes,
						default: '',
				},
		];
}