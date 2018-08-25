import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import SpendingContainer from '../../../src/containers/lists/Spending';

describe("SpendingListContainer tests", () => {

    let item = null;

    beforeEach(() => {
        item = new SpendingContainer();
        Store.store.dispatch(actions.changeProperties(
            {
                item:{},
                errors:{},
                spending_types: [{"label": "USN", "value": "1"}]
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

        test("Render period field (string)", () => {
            expect(item.renderListField('period','2018')).toBe('2018');
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

        test("Render type field (string)", () => {
            expect(item.renderListField('type','1')).toBe("1");
        });
    })

});



