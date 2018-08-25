import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import AccountContainer from '../../../src/containers/lists/Account';

describe("AccountListContainer tests", () => {

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

    describe("renderListField tests", () => {

        test("Render company field (string)", () => {
            expect(item.renderListField('company','Test')).toBe('Test');
        });

        test("Render bank_name field (string)", () => {
            expect(item.renderListField('bank_name','Test')).toBe('Test');
        });

        test("Render bik field (string)", () => {
            expect(item.renderListField('bik','Test')).toBe('Test');
        });

        test("Render number field (string)", () => {
            expect(item.renderListField('number','Test')).toBe('Test');
        });

        test("Render ks field (string)", () => {
            expect(item.renderListField('ks','Test')).toBe('Test');
        });

    })

});



