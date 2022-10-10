import { ICashFlow, CashFlow } from "./index";

describe('CashFlow Lib Test', () => {

    //establece que las pruebas unitarias => it should 

    it('should create an Instance CashFlow', () => {
        const cashFlowInstance= new CashFlow();

        //espera que cashFlowInstance esta trabajando bien 
        expect(cashFlowInstance).toBeDefined();
    })

    //prueba unitaria para poder ver si funciona la funcion de añadir
    //un elemento al cashFlow

    it('should add a new CashFlow Item', () =>  {
        const cashFlowInstance= new CashFlow();

        const cashFlowItem: ICashFlow= {
            type: 'INCOME',
            date: new Date(),
            amount: 100, 
            description: 'Receipt A101 from SW'
        }

        //el index va a esperar que la agregue
        const index= cashFlowInstance.addCashFlow(cashFlowItem);

        //aqui decimos que espera que el indice sea 0 porque el primer
        //elemento de cada arrgelo es 0 
        expect(index).toBe(0);

    })
})