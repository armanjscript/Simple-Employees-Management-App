const {Employee} = require('./db');

class Management {
    constructor(new_employee = null){
        if(new_employee){
            this.firstname = new_employee.floating_first_name;
            this.lastname = new_employee.floating_last_name;
            this.email = new_employee.floating_email;
        }
    }
    async add_employee(){
        const employee_exist = await Employee.findOne({where: {email: this.email}});
        if (!employee_exist){
            
            const employee = Employee.build({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email
            });
            await employee.save();
            return {message: 'Employee added'};
        }
        else{
            return {message: 'Employee exists'};
        }
        
    }
    async getAll(){
        const employees = await Employee.findAll();
        if(employees.length==0){
            return {items: null, message: 'No information about employess!'};
        }
        else{
            return {items: employees, message: null};
        }
    }

    async getEmployee(id = 1){
        const employee = await Employee.findOne({where:{id: id}});
        if(employee){
            return {item: employee, message:'Updating'};
        }
        else{
            return {item: null, message:'Nothing'};
        }
    }

    async updateEmployee(id = 1){
        const employee = await Employee.findOne({where: {id: id}});
        if(employee){
            employee.firstname = this.firstname;
            employee.lastname = this.lastname;
            employee.email = this.email;
            await employee.save();
            return {edit_message: 'Employee successfully updated'};
        }
        else{
            return {edit_message: 'Error in updating employee'};
        }
    }

    async deleteEmployee(id = 1){
        const employee = await Employee.findOne({where: {id: id}});
        if(employee){
            await employee.destroy();
            return {edit_message: 'Employee deleted successfully'};
        }
        else{
            return {edit_message: 'Error in deleting employee'};
        }
    }
}

module.exports = {Management};