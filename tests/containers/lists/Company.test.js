import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import CompanyContainer from '../../../src/containers/lists/Company';

describe("CompanyListContainer tests", () => {

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

    describe("renderListField tests", () => {

        test("Render name field (string)", () => {
            expect(item.renderListField('name','Test')).toBe('Test');
        });

        test("Render type field (string)", () => {
            expect(item.renderListField('type','Test')).toBe('Test');
        });

        test("Render inn field (string)", () => {
            expect(item.renderListField('inn','Test')).toBe('Test');
        });

        test("Render kpp field (string)", () => {
            expect(item.renderListField('kpp','Test')).toBe('Test');
        });

        test("Render address field (string)", () => {
            expect(item.renderListField('address','Test')).toBe('Test');
        });
        
    })

});



