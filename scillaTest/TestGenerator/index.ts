import { writeFile, setValForParams } from '../utill';
import { ValueParams, ValueField, ValueParam, Params } from '../types';

type obj = { [key: string]: any };

export type TestBody = {
    code: string, init: obj, blockchain: obj, output: obj, message: obj, state: obj
}

export type _Dirs = {
    testResultAbsolutePath: string,
}

class TestGenerator {
    private _dirs: _Dirs;

    /**
     * 
     * @param _dirs a dict with the directories to write the output to
     */
    constructor(_dirs: _Dirs) {
        this._dirs = _dirs;
    }

    /**
     * Writes a testfile to reuse later
     * @param testName 
     * @param fileJson 
     */
    write(testName: string, fileJson: { [key: string]: any }) {
        writeFile(this._dirs.testResultAbsolutePath, testName, "json", fileJson);
    }

    /**
     * Generates the initial contract immutable field values json
     * Uses the params one can get from the checker output: .contract_info.params
     * @param params 
     * @param conf
     */
    genInit(params: Params, conf: { [key: string]: ValueField }) {
        return [
            {
                "vname": "_scilla_version",
                "type": "Uint32",
                "value": "0"
            },
            {
                "vname": "_this_address",
                "type": "ByStr20",
                "value": "0xabfeccdc9012345678901234567890f777567890"
            },
            {
                "vname": "_creation_block",
                "type": "BNum",
                "value": "1"
            },
            ...setValForParams(params, conf)]
    }

    /**
     * Generates the initial contract immutable field values json
     * @param params 
     */
    genInitFromRaw(params: ValueParams) {
        return [
            {
                "vname": "_scilla_version",
                "type": "Uint32",
                "value": "0"
            },
            {
                "vname": "_this_address",
                "type": "ByStr20",
                "value": "0xabfeccdc9012345678901234567890f777567890"
            },
            {
                "vname": "_creation_block",
                "type": "BNum",
                "value": "1"
            },
            ...params]
    }

    /**
     * Generates the blockchain state json
     * @param bNumVal
     */
    genBlockchain(bNumVal: string) {
        return [
            {
                "vname": "BLOCKNUMBER",
                "type": "BNum",
                "value": bNumVal
            }
        ]
    }

    /**
     * This is a required field but doesnt seem to have any utility
     */
    genOutput() {
        return [];
    }

    /**
     * Generates the message aka a transition call on the contract
     * @param messageName 
     * @param params 
     * @param _sender 
     * @param _amount 
     */
    genMessage(messageName: string, params: Params, _sender: string, _amount: string) {
        return {
            "_tag": messageName,
            "_amount": "0",
            "_sender": _sender,
            "params": params,
            "_origin": _sender
        }
    }

    /**
     * Generates the json representing the current state of the mutable fields of the contract
     * as well as the contract balance
     * @param params 
     * @param _balance 
     */
    genState(params: ValueParams, _balance: string) {
        return [...params, {
            "vname": "_balance",
            "type": "Uint128",
            "value": _balance
        }];
    }

    /**
     * Generates the json that is composed of the required test parameters
     * @param code 
     * @param init 
     * @param blockchain 
     * @param output 
     * @param message 
     * @param state 
     */
    genTestBody(code: string, init: obj, blockchain: obj, output: obj, message: obj, state: obj) {
        return {
            "code": code,
            "init": JSON.stringify(init),
            "blockchain": JSON.stringify(blockchain),
            "output": JSON.stringify(output),
            "message": JSON.stringify(message),
            "state": JSON.stringify(state),
        }
    }

    /**
     * Used to generate value objects for scilla variables
     * @param type Valid scilla type
     * @param vname name of the variable
     * @param value value of the variable
     */
    createValueParam(type: string, vname: string, value: ValueField): ValueParam {
        const param = {
            type,
            vname,
            value
        }
        return param;
    }
}

export default TestGenerator;