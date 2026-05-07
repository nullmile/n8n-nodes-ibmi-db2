import { Icon, ICredentialType, INodeProperties } from "n8n-workflow";

export class IbmiDb2Api implements ICredentialType {
    name = 'ibmiDb2Api';

    displayName = 'DB2 for IBM i API';

    icon: Icon = 'file:../icons/ibmDb2.svg';

    properties: INodeProperties[] = [
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: ''
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: ''
        }
    ];
}