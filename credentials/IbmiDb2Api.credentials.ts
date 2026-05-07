import { Icon, ICredentialType } from "n8n-workflow";

export class IbmiDb2Api implements ICredentialType {
    name = 'ibmiDb2Api';

    displayName = 'DB2 for IBM i API';

    icon: Icon = 'file:../icons/ibmDb2.svg';

    properties = [];
}