import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import IncomeContainer from '../../../src/containers/items/Income';

describe("IncomeItemContainer tests", () => {

    let item = null;

    beforeEach(() => {
        item = new IncomeContainer();
        Store.store.dispatch(actions.changeProperties(
            {
                item:{},
                errors:{}
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
                        income: {
                            'description': '',
                            'company': '',
                            'number': '',
                            'date': '',
                            'amount': ''
                        }
                    }
                }
            ));
            item.saveToBackend();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(5)
        });

        test("Validation test (incorrect data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        income: {
                            'description': 'ddg',
                            'company': '',
                            'number': 'dfgfd',
                            'date': {"boo":"woo"},
                            'amount': "3345,32"
                        }
                    }
                }
            ));
            item.saveToBackend();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(4)
        });

        test("Validation test (correct data provided, server returned no response)", (done) => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        income: {
                            'description': 'ddg',
                            'company': 'test',
                            'number': '145',
                            'date': "123353453",
                            'amount': "3345.32"
                        }
                    }
                }
            ));
            item.model = {
                saveItem : (options,callback) => {
                    callback(null)
                },
                validate: item.model.validate};
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
                        income: {
                            'description': 'ddg',
                            'company': 'test',
                            'number': '145',
                            'date': "123353453",
                            'amount': "3345.32"
                        }
                    }
                }
            ));
            item.model = {
                saveItem : (options,callback) => {
                    callback(null,{errors:{company:'1',number:'2'}})
            },
                validate: item.model.validate};
            item.saveToBackend(() => {
                const errors = getErrors();
                expect(Object.keys(errors).length).toBe(2);
                expect(errors["company"]).toBe("1");
                expect(errors["number"]).toBe("2");
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
            };
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        income: itemData
                    }
                }
            ));
            item.model = {
                itemName: 'income',
                saveItem : (options,callback) => {
                    callback(null,{result:{
                            uid:123,
                            ...itemData
                    }})
                },
                validate: item.model.validate.bind(item.model)};
            item.saveToBackend(() => {
                const errors = getErrors();
                const state = Store.getState();
                const item = state.item['income'];
                expect(Object.keys(errors).length).toBe(0);
                expect(state.itemSaveSuccessText.length).toBeGreaterThan(0);
                expect(item.uid).toBe(123);
                done()
            });
        });

        describe("initItem tests", () => {
            test("Should fill all undefined fields", () => {
                const data = item.initItem();
                expect(data.company).toBeDefined();
                expect(data.number).toBeDefined();
                expect(data.date).toBeDefined();
                expect(data.amount).toBeDefined();
                expect(data.description).toBeDefined();
            })
        })
    })

});



