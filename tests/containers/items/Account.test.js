import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import AccountContainer from '../../../src/containers/items/Account';

describe("AccountItemContainer tests", () => {

    let item = null;

    beforeEach(() => {
        item = new AccountContainer();
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

        test("Validate bank_name (empty string)", () => {
            item.changeItemField('bank_name','   ');
            const error = getErrors()['bank_name'];
            expect(error).toBeTruthy()
        });

        test("Validate bank_name (not empty field)", () => {
            item.changeItemField('bank_name','test');
            const error = getErrors()['bank_name'];
            expect(error).toBeFalsy()
        });

        test("Validate incorrect bik (empty value)", () => {
            item.changeItemField("bik","");
            const error = getErrors()["bik"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect bik (string value)", () => {
            item.changeItemField("bik","fsdfs");
            const error = getErrors()["bik"];
            expect(error).toBeTruthy()
        });

        test("Validate correct bik", () => {
            item.changeItemField("bik",23432);
            const error = getErrors()["bik"];
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

        test("Validate incorrect ks (empty value)", () => {
            item.changeItemField("ks","");
            const error = getErrors()["ks"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect ks (string value)", () => {
            item.changeItemField("ks","fsdfs");
            const error = getErrors()["ks"];
            expect(error).toBeTruthy()
        });

        test("Validate correct ks", () => {
            item.changeItemField("ks",23432);
            const error = getErrors()["ks"];
            expect(error).toBeFalsy()
        });

    });

    describe("saveToBackend tests", () => {
        test("Validation test (no data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        account: {
                            'bank_name': '',
                            'company': '',
                            'number': '',
                            'bik': '',
                            'ks': ''
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
                        account: {
                            'bank_name': '',
                            'company': '',
                            'number': 'dfgfd',
                            'bik': {"boo":"woo"},
                            'ks': "3345,32"
                        }
                    }
                }
            ));
            item.saveToBackend();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(5)
        });

        test("Validation test (correct data provided, server returned no response)", (done) => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        account: {
                            'bank_name': 'ddg',
                            'company': 'test',
                            'number': '145',
                            'bik': "123353453",
                            'ks': "334532"
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
                        account: {
                            'bank_name': 'ddg',
                            'company': 'test',
                            'number': '145',
                            'bik': "123353453",
                            'ks': "334532"
                        }
                    }
                }
            ));
            item.model = {
                saveItem : (options,callback) => {
                    callback(null,{errors:{company:'1',number:'2'}})
                },
                validate: item.model.validate.bind(item.model)
            };
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
                'bank_name': 'ddg',
                'company': 'test',
                'number': '145',
                'bik': "123353453",
                'ks': "334532",
            };
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        account: itemData
                    }
                }
            ));
            item.model = {
                itemName: 'account',
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
                const item = state.item['account'];
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
            expect(data.bank_name).toBeDefined();
            expect(data.number).toBeDefined();
            expect(data.bik).toBeDefined();
            expect(data.ks).toBeDefined();
        })
    })

});



