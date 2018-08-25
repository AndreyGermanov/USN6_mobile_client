import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import CompanyContainer from '../../../src/containers/items/Company';

describe("CompanyItemContainer tests", () => {

    let item = null;

    beforeEach(() => {
        item = new CompanyContainer();
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

        test("Validate incorrect name (empty string)", () => {
            item.changeItemField('name','   ');
            const error = getErrors()['name'];
            expect(error).toBeTruthy()
        });

        test("Validate correct name", () => {
            item.changeItemField('name','test');
            const error = getErrors()['name'];
            expect(error).toBeFalsy()
        });

        test("Validate address (empty string)", () => {
            item.changeItemField('address','   ');
            const error = getErrors()['address'];
            expect(error).toBeTruthy()
        });

        test("Validate address (not empty field)", () => {
            item.changeItemField('address','test');
            const error = getErrors()['address'];
            expect(error).toBeFalsy()
        });

        test("Validate inn (empty string)", () => {
            item.changeItemField('inn','   ');
            const error = getErrors()['inn'];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect inn (string)", () => {
            item.changeItemField('inn','test');
            const error = getErrors()['inn'];
            expect(error).toBeTruthy()
        });

        test("Validate correct inn", () => {
            item.changeItemField('inn',12335353);
            const error = getErrors()['inn'];
            expect(error).toBeFalsy()
        });

        test("Validate kpp (empty string)", () => {
            Store.store.dispatch(actions.changeProperty('item',{
                company:{
                    type:2
                }
            }));
            item.changeItemField('kpp','   ');
            const error = getErrors()['kpp'];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect kpp (string)", () => {
            Store.store.dispatch(actions.changeProperty('item',{
                company:{
                    type:2
                }
            }));
            item.changeItemField('kpp','test');
            const error = getErrors()['kpp'];
            expect(error).toBeTruthy()
        });

        test("Validate correct kpp", () => {
            Store.store.dispatch(actions.changeProperty('item',{
                company:{
                    type:2
                }
            }));
            item.changeItemField('kpp',12335353);
            const error = getErrors()['kpp'];
            expect(error).toBeFalsy()
        });

        test("Validate incorrect type (empty value)", () => {
            item.changeItemField("type","");
            const error = getErrors()["type"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect type (string value)", () => {
            item.changeItemField("type","fsdfs");
            const error = getErrors()["type"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect type (incorrect type)", () => {
            item.changeItemField("type",5);
            const error = getErrors()["type"];
            expect(error).toBeTruthy()
        });

        test("Validate correct type", () => {
            item.changeItemField("type",2);
            const error = getErrors()["type"];
            expect(error).toBeFalsy()
        });


    });

    describe("saveToBackend tests", () => {
        test("Validation test (no data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        company: {
                            'inn': '',
                            'kpp': '',
                            'name': '',
                            'address': '',
                            'type': ''
                        }
                    }
                }
            ));
            item.saveToBackend();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(4)
        });

        test("Validation test (incorrect data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        company: {
                            'inn': 'fsdfsd',
                            'kpp': 'ergdhf',
                            'name': '',
                            'address': '',
                            'type': '2'

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
                        company: {
                            'inn': 2342124,
                            'kpp': 5342534,
                            'name': 'Test',
                            'address': 'addr',
                            'type': 2
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
                        company: {
                            'inn': 2342124,
                            'kpp': 5342534,
                            'name': 'Test',
                            'address': 'addr',
                            'type': 2
                        }
                    }
                }
            ));
            item.model = {
                saveItem : (options,callback) => {
                    callback(null,{errors:{company:'1',kpp:'2'}})
                },
                validate: item.model.validate.bind(item.model)
            };
            item.saveToBackend(() => {
                const errors = getErrors();
                expect(Object.keys(errors).length).toBe(2);
                expect(errors["company"]).toBe("1");
                expect(errors["kpp"]).toBe("2");
                done()
            });
        });

        test("Validation test (correct data provided, server returned success response)", (done) => {
            const itemData = {
                'inn': 2342124,
                'kpp': 5342534,
                'name': 'Test',
                'address': 'addr',
                'type': 2
            };
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        company: itemData
                    }
                }
            ));
            item.model = {
                itemName: 'company',
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
                const item = state.item['company'];
                expect(Object.keys(errors).length).toBe(0);
                expect(state.itemSaveSuccessText.length).toBeGreaterThan(0);
                expect(item.uid).toBe(123);
                done()
            });
        });
    })

});



