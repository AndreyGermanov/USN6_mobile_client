import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import SpendingContainer from '../../../src/containers/items/Spending';

describe("SpendingItemContainer tests", () => {

    let item = null;

    beforeEach(() => {
        item = new SpendingContainer();
        Store.store.dispatch(actions.changeProperties(
            {
                item:{},
                errors:{},
                spending_types: [{"label": "Оплата налога УСН", "value": "1"}]
            }
            )
        );
    });

    const getErrors = () => {
        return Store.getState().errors;
    };


    describe("changeItemField tests", () => {

        test("Validate incorrect company (empty string)", () => {
            item.changeItemField('company','   ');
            const error = getErrors()['company'];
            expect(error).toBeTruthy()
        });

        test("Validate correct company", () => {
            item.changeItemField('company','test');
            const error = getErrors()['company'];
            expect(error).toBeFalsy()
        });

        test("Validate description (empty string)", () => {
            item.changeItemField('description','   ');
            const error = getErrors()['description'];
            expect(error).toBeTruthy()
        });

        test("Validate description (not empty field)", () => {
            item.changeItemField('description','test');
            const error = getErrors()['description'];
            expect(error).toBeFalsy()
        });

        test("Validate incorrect period (empty string)", () => {
            item.changeItemField('period','   ');
            const error = getErrors()['period'];
            expect(error).toBeTruthy()
        });

        test("Validate correct period", () => {
            item.changeItemField('period','test');
            const error = getErrors()['period'];
            expect(error).toBeFalsy()
        });


        test("Validate incorrect date (empty date)", () => {
            item.changeItemField("date","");
            const error = getErrors()["date"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect date (string value)", () => {
            item.changeItemField("date","fssfs");
            const error = getErrors()["date"];
            expect(error).toBeTruthy();
        });

        test("Validate incorrect date (object value)", () => {
            item.changeItemField("date",{date:123223});
            const error = getErrors()["date"];
            expect(error).toBeTruthy();
        });


        test("Validate correct date", () => {
            item.changeItemField("date",1233422340000);
            const error = getErrors()["date"];
            expect(error).toBeFalsy();
        });


        test("Validate incorrect type (empty value)", () => {
            item.changeItemField("type","");
            const error = getErrors()["type"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect type (incorrect value)", () => {
            item.changeItemField("type","testsd");
            const error = getErrors()["type"];
            expect(error).toBeTruthy()
        });

        test("Validate correct type", () => {
            item.changeItemField("type","1");
            const error = getErrors()["type"];
            expect(error).toBeFalsy()
        });

        test("Validate incorrect number (empty value)", () => {
            item.changeItemField("number","");
            const error = getErrors()["number"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect number (string value)", () => {
            item.changeItemField("number","fsdfs");
            const error = getErrors()["number"];
            expect(error).toBeTruthy()
        });

        test("Validate correct number", () => {
            item.changeItemField("number",23432);
            const error = getErrors()["number"];
            expect(error).toBeFalsy()
        });

        test("Validate incorrect amount (empty value)", () => {
            item.changeItemField("amount","");
            const error = getErrors()["amount"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect amount (string value)", () => {
            item.changeItemField("amount","fsdfs");
            const error = getErrors()["amount"];
            expect(error).toBeTruthy()
        });

        test("Validate correct amount", () => {
            item.changeItemField("amount",23432.34);
            const error = getErrors()["amount"];
            expect(error).toBeFalsy()
        });

    });

    describe("saveToBackend tests", () => {
        test("Validation test (no data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        spending: {
                            'description': '',
                            'company': '',
                            'number': '',
                            'date': '',
                            'amount': '',
                            'type': '',
                            'period': '',
                        }
                    }
                }
            ));
            item.saveToBackend();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(7)
        });

        test("Validation test (incorrect data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        spending: {
                            'description': 'ddg',
                            'company': '',
                            'number': 'dfgfd',
                            'date': {"boo":"woo"},
                            'amount': "3345,32",
                            'type': 'kudir',
                            'period': '',
                        }
                    }
                }
            ));
            item.saveToBackend();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(6)
        });

        test("Validation test (correct data provided, server returned no response)", (done) => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        spending: {
                            'description': 'ddg',
                            'company': 'test',
                            'number': '145',
                            'date': "123353453",
                            'amount': "3345.32",
                            'type': '1',
                            'period': '2018',
                        }
                    }
                }
            ));
            item.model = {
                saveItem : (options,callback) => {
                    callback(null)
                },
                validate: item.model.validate.bind(item.model)
            };
            item.saveToBackend(() => {
                const errors = getErrors();
                expect(Object.keys(errors).length).toBe(1);
                done()
            });
        });

        test("Validation test (correct data provided, server returned error response)", (done) => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        spending: {
                            'description': 'ddg',
                            'company': 'test',
                            'number': '145',
                            'date': "123353453",
                            'amount': "3345.32",
                            'type': '1',
                            'period': '2018',
                        }
                    }
                }
            ));
            item.model = {
                saveItem : (options,callback) => {
                    callback(null,{errors:{company:'1',type:'2'}})
                },
                validate: item.model.validate.bind(item.model)
            };
            item.saveToBackend(() => {
                const errors = getErrors();
                expect(Object.keys(errors).length).toBe(2);
                expect(errors["company"]).toBe("1");
                expect(errors["type"]).toBe("2");
                done()
            });
        });

        test("Validation test (correct data provided, server returned success response)", (done) => {
            const itemData = {
                'description': 'ddg',
                'company': 'test',
                'number': '145',
                'date': "123353453",
                'amount': "3345.32",
                'type': '1',
                'period': '2018',
            };
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        spending: itemData
                    }
                }
            ));
            item.model = {
                itemName: 'spending',
                saveItem : (options,callback) => {
                    callback(null,{result:{
                            uid:123,
                            ...itemData
                    }})
                },
                validate: item.model.validate.bind(item.model)
            };
            item.saveToBackend(() => {
                const errors = getErrors();
                const state = Store.getState();
                const item = state.item['spending'];
                expect(Object.keys(errors).length).toBe(0);
                expect(state.itemSaveSuccessText.length).toBeGreaterThan(0);
                expect(item.uid).toBe(123);
                done()
            });
        });
    })

    describe("initItem tests", () => {
        test("Should fill all undefined fields", () => {
            const data = item.initItem();
            expect(data.company).toBeDefined();
            expect(data.period).toBeDefined();
            expect(data.number).toBeDefined();
            expect(data.date).toBeDefined();
            expect(data.amount).toBeDefined();
            expect(data.description).toBeDefined();
            expect(data.type).toBe(1);
        })
    })

});



