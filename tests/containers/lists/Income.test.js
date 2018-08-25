import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import IncomeContainer from '../../../src/containers/lists/Income';

describe("IncomeListContainer tests", () => {

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

    describe("renderListField tests", () => {

        test("Render company field (string)", () => {
            expect(item.renderListField('company','Test')).toBe('Test');
        });

        test("Render description field (string)", () => {
            expect(item.renderListField('description','Test')).toBe('Test');
        });

        test("Render number field (string)", () => {
            expect(item.renderListField('number','123')).toBe('123');
        });

        test("Render amount field (empty string)", () => {
            expect(item.renderListField('amount',' ')).toBe(0);
        });

        test("Render amount field (incorrect string)", () => {
            expect(item.renderListField('amount','gdfgfdg')).toBe(0);
        });

        test("Render amount field (correct value)", () => {
            expect(item.renderListField('amount','154.3423')).toBe("154.34");
        });

        test("Render date field (empty string)", () => {
            expect(item.renderListField('date',' ')).toBe(0);
        });

        test("Render date field (incorrect string)", () => {
            expect(item.renderListField('date','gdfgfdg')).toBe(0);
        });

        test("Render date field (correct value)", () => {
            expect(item.renderListField('date','1535217250')).toBe("25.08.2018 20:14:10");
        });
    })

});



