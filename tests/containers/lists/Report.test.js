import Store from "../../../src/store/Store";
import actions from '../../../src/actions/Actions';
import ReportContainer from '../../../src/containers/lists/Report';

describe("ReportListContainer tests", () => {

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
        return Store.getState().errors;
    };


    describe("renderListField tests", () => {

        test("Render company field (string)", () => {
            expect(item.renderListField('company','Test')).toBe('Test');
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

        test("Render period field (empty string)", () => {
            expect(item.renderListField('period',' ')).toBe(0);
        });

        test("Render period field (incorrect string)", () => {
            expect(item.renderListField('period','gdfgfdg')).toBe(0);
        });

        test("Render period field (correct value)", () => {
            expect(item.renderListField('period','1535217250')).toBe("2018 г.");
        });

        test("Render email field (string)", () => {
            expect(item.renderListField('email','test@test.com')).toBe('test@test.com');
        });

        test("Render type field (empty string)", () => {
            expect(item.renderListField('type',' ')).toBe('');
        });

        test("Render type field (incorrect string)", () => {
            expect(item.renderListField('type','gdfgfdg')).toBe('');
        });

        test("Render type field (correct value)", () => {
            expect(item.renderListField('type','kudir')).toBe("KUDIR");
        });

    })

});



