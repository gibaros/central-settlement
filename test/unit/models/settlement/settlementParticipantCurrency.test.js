/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Georgi Georgiev <georgi.georgiev@modusbox.com>
 --------------
 ******/

'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Logger = require('@mojaloop/central-services-shared').Logger
const SettlementParticipantCurrencyModel = require('../../../../src/models/settlement/settlementParticipantCurrency')
const Db = require('../../../../src/models')

Test('SettlementParticipantCurrencyModel', async (settlementParticipantCurrencyModelTest) => {
  let sandbox

  settlementParticipantCurrencyModelTest.beforeEach(test => {
    sandbox = Sinon.createSandbox()
    test.end()
  })

  settlementParticipantCurrencyModelTest.afterEach(test => {
    sandbox.restore()
    test.end()
  })

  await settlementParticipantCurrencyModelTest.test('settlementParticipantCurrencyModel should', async getAccountInSettlementTest => {
    try {
      await getAccountInSettlementTest.test('return settlement participant account id if matched', async test => {
        try {
          const settlementId = 1
          const accountId = 1
          const params = {settlementId, accountId}
          const enums = {}
          const settlementParticipantCurrencyIdMock = 1

          const builderStub = sandbox.stub()
          Db.settlementParticipantCurrency = {
            query: sandbox.stub()
          }
          Db.settlementParticipantCurrency.query.callsArgWith(0, builderStub)
          const whereStub = sandbox.stub()
          const andWhereStub = sandbox.stub()
          builderStub.select = sandbox.stub().returns({
            where: whereStub.returns({
              andWhere: andWhereStub.returns(settlementParticipantCurrencyIdMock)
            })
          })

          let result = await SettlementParticipantCurrencyModel.getAccountInSettlement(params, enums)
          test.ok(result, 'Result returned')
          test.ok(builderStub.select.withArgs('settlementParticipantCurrencyId').calledOnce, 'select with args ... called once')
          test.ok(whereStub.withArgs({settlementId}).calledOnce, 'where with args ... called once')
          test.ok(andWhereStub.withArgs('settlementParticipantCurrencyId', accountId).calledOnce, 'where with args ... called once')
          test.equal(result, settlementParticipantCurrencyIdMock, 'Result matched')

          Db.settlementParticipantCurrency.query = sandbox.stub().throws(new Error('Error occured'))
          try {
            result = await SettlementParticipantCurrencyModel.getAccountInSettlement(params)
            test.fail('Error expected, but not thrown!')
          } catch (err) {
            test.equal(err.message, 'Error occured', `Error "${err.message}" thrown as expected`)
          }
          test.end()
        } catch (err) {
          Logger.error(`getAccountInSettlementTest failed with error - ${err}`)
          test.fail()
          test.end()
        }
      })

      await getAccountInSettlementTest.end()
    } catch (err) {
      Logger.error(`settlementParticipantCurrencyModelTest failed with error - ${err}`)
      getAccountInSettlementTest.fail()
      getAccountInSettlementTest.end()
    }
  })

  await settlementParticipantCurrencyModelTest.end()
})