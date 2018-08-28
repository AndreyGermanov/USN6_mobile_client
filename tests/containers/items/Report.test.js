import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import ReportContainer from '../../../src/containers/items/Report';

describe("ReportItemContainer tests", () => {

    let item = null;

    beforeEach(() => {
        item = new ReportContainer();
        Store.store.dispatch(actions.changeProperties(
            {
                item:{},
                errors:{},
                report_types: [{"label": "KUDIR", "value": "kudir"}]
            }
            )
        );
    });

    const getErrors = () => {
        return Store.getState().errors ? Store.getState().errors : {};
    };


    describe("changeItemField tests", () => {

        test("Validate correct email (empty string)", () => {
            item.changeItemField('email','');
            const error = getErrors()['email'];
            expect(error).toBeFalsy()
        });

        test("Validate correct email (incorrect email)", () => {
            item.changeItemField('email','fsdf.wer');
            const error = getErrors()['email'];
            expect(error).toBeTruthy()
        });

        test("Validate correct email", () => {
            item.changeItemField('email','test@test.com');
            const error = getErrors()['email'];
            expect(error).toBeFalsy()
        });

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

        test("Validate incorrect period (empty date)", () => {
            item.changeItemField("period","");
            const error = getErrors()["period"];
            expect(error).toBeTruthy()
        });

        test("Validate incorrect period (string value)", () => {
            item.changeItemField("period","fssfs");
            const error = getErrors()["period"];
            expect(error).toBeTruthy();
        });

        test("Validate incorrect period (object value)", () => {
            item.changeItemField("period",{date:123223});
            const error = getErrors()["period"];
            expect(error).toBeTruthy();
        });

        test("Validate correct period", () => {
            item.changeItemField("period",1233422340000);
            const error = getErrors()["period"];
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
            item.changeItemField("type","kudir");
            const error = getErrors()["type"];
            expect(error).toBeFalsy()
        });

    });

    describe("saveToBackend tests", () => {
        test("Validation test (no data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        report: {
                            'date': '',
                            'period': '',
                            'email':'',
                            'company': '',
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
                        report: {
                            'date': {"boo":"woo"},
                            'period': 'sdgsdd',
                            'email':'fsdsf',
                            'company': '  ',
                            'type': 'dgs'
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
                        report: {
                            'date': 15443343234,
                            'period': 12323533,
                            'email':'test@test.com',
                            'company': 'Test.ru',
                            'type': 'kudir'
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
                        report: {
                            'date': 15443343234,
                            'period': 12323533,
                            'email':'test@test.com',
                            'company': 'Test.ru',
                            'type': 'kudir'
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
                'date': 15443343234,
                'period': 12323533,
                'email':'test@test.com',
                'company': 'Test.ru',
                'type': 'kudir'
            };
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        report: itemData
                    }
                }
            ));
            item.model = {
                itemName: 'report',
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
                const item = state.item['report'];
                expect(Object.keys(errors).length).toBe(0);
                expect(state.itemSaveSuccessText.length).toBeGreaterThan(0);
                expect(item.uid).toBe(123);
                done()
            });
        });
    });

    describe("sendByEmail tests", () => {

        test("Validation test (no data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        report: {
                            'date': '',
                            'period': '',
                            'email':'',
                            'company': '',
                            'type': ''
                        }
                    }
                }
            ));
            item.sendByEmail();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(5)
        });

        test("Validation test (incorrect data provided)", () => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        report: {
                            'date': {"boo":"woo"},
                            'period': 'sdgsdd',
                            'email':'fsdsf',
                            'company': '  ',
                            'type': 'dgs'
                        }
                    }
                }
            ));
            item.sendByEmail();
            const errors = getErrors();
            expect(Object.keys(errors).length).toBe(5)
        });

        test("Validation test (correct data provided, server returned no response)", (done) => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        report: {
                            'date': 15443343234,
                            'period': 12323533,
                            'email':'test@test.com',
                            'company': 'Test.ru',
                            'type': 'kudir'
                        }
                    }
                }
            ));
            item.model = {
                itemName: 'report',
                sendByEmail : (options,callback) => {
                    callback(null,{text: () => new Promise((resolve,reject) => {resolve(null)})})
                },
                validate: item.model.validate.bind(item.model)
            };
            item.sendByEmail(() => {
                const errors = getErrors();
                const state = Store.getState();
                expect(Object.keys(errors).length).toBe(0);
                expect(state.itemSaveSuccessText.length).toBeGreaterThan(0);
                done();
            });
        });


        test("Validation test (correct data provided, server returned error response)", (done) => {
            Store.store.dispatch(actions.changeProperties(
                {
                    item: {
                        report: {
                            'date': 15443343234,
                            'period': 12323533,
                            'email':'test@test.com',
                            'company': 'Test.ru',
                            'type': 'kudir'
                        }
                    }
                }
            ));
            item.model = {
                itemName: 'report',
                sendByEmail : (options,callback) => {
                    callback(null,{text: () => new Promise((resolve,reject) => {resolve("ERROR")})})
                },
                validate: item.model.validate.bind(item.model)
            };
            item.sendByEmail(() => {
                const errors = getErrors();
                expect(Object.keys(errors).length).toBe(1);
                expect(errors["general"]).toBe("ERROR");
                done()
            });
        });

    });

    describe("initItem tests", () => {
        test("Should fill all undefined fields", () => {
            const data = item.initItem();
            expect(data.company).toBeDefined();
            expect(data.period).toBeDefined();
            expect(data.date).toBeDefined();
            expect(data.email).toBeDefined();
            expect(data.type).toBe("kudir");
        })
    })

});



