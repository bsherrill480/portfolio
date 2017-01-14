const _ = require('lodash'),
    Promise = require('bluebird'),
    userTestUtil = require('./user_test_util'),
    models = require('../../../server/db/model/models'),
    eventGeneratorConsts =
        require('../../../server/db/model/event_generator/event_generator_consts'),
    testEventGenerators = {
        // keep question unique
        eg1: {
            _user: null,
            question: 'a',
            date: new Date(0),
            intervalYear: 1,
            intervalMonth: 0,
            intervalDay: 0,
            generatorType: eventGeneratorConsts.HOMEOWNER,
            nextReminderDate: new Date(0)
        }
    },
    testEventGeneratorGen = {
        _testGenerator: 0,
        
        generateEventGenerator(generatorType) {
            const testStr = String(this._testGenerator),
                testInt = this._testGenerator;
            generatorType = generatorType || eventGeneratorConsts.HOMEOWNER;
            this._testGenerator++;
            return {
                question: testStr,
                date: new Date(testInt),
                intervalYear: testInt,
                intervalMonth: testInt,
                intervalDay: testInt,
                generatorType: generatorType
            }
        }
    };

function generateEventGenerator(generatorType) {
    return testEventGeneratorGen.generateEventGenerator(generatorType);
}

function getEventGeneratorsForTestUser(testUser) {
    return new Promise(function(resolve, reject) {
        userTestUtil.testUsers.getTestUser(testUser)
            .then(function (user) {
                models.eventGeneratorAPI.findAllEventGeneratorsForUser(user._id)
                    .then(function (eventGenerators) {
                        resolve(eventGenerators)
                    })
                    .catch(reject)
            })
            .catch(reject);
    });
}

module.exports = {

    testEventGenerators: testEventGenerators,
    
    // target is usually a generated user
    expectEventGenerator(eventGenerator, target, options) {
        const isServerResponse = _.get(options, 'isServerResponse');
        if(isServerResponse) {
            expect(eventGenerator.date).toEqual(jasmine.any(String));
            eventGenerator.date = new Date(eventGenerator.date);
        }
        expect(eventGenerator).toBeTruthy();
        expect(eventGenerator._user.toString()).toBe(target._user.toString());
        expect(eventGenerator.question).toBe(target.question);
        expect(eventGenerator.date.getTime()).toBe(target.date.getTime());
        expect(eventGenerator.intervalYear).toBe(target.intervalYear);
        expect(eventGenerator.intervalMonth).toBe(target.intervalMonth);
        expect(eventGenerator.intervalDay).toBe(target.intervalDay);
        expect(eventGenerator.generatorType).toBe(target.generatorType);
        expect(eventGenerator.updatedAt).toBeDefined();
        expect(eventGenerator.createdAt).toBeDefined();
        expect(eventGenerator._id).toBeDefined();
    },
    
    generateEventGenerator: generateEventGenerator,
    
    getEventGeneratorsForTestUser: getEventGeneratorsForTestUser
    
};

