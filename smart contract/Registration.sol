// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Registration{
    /*------structure for registration--------*/
    struct fromRegistration{
        string name;
        string email;
        string uniId;
        string myAddress;
        string role;
    }

    /*-----mapping the structure--------*/
    mapping(string => fromRegistration) registrationProcess;

    address public admin;
    address public student;

    constructor(){
        admin = msg.sender;
    }

    /*-------modifiers to check transaction---------*/
    modifier isAdmin(){
        require(admin == msg.sender, "You cannot do transaciton");
        _;
    } 

    modifier notStudent(){
        require(student != msg.sender, "I am a student");
        _;
    } 

    /*------creating an event-------*/
    event logFromSubmission(
        string name,
        string email,
        string uniId,
        string myAddress,
        string role
    );


    /*------store registration information---------*/ 
    function storeRegistrationInformation(string memory _name, string memory _email, string memory _uniId, string memory _myAddress, string memory _role)public
    isAdmin()
    notStudent()
    {
        registrationProcess[_uniId].name = _name;
        registrationProcess[_uniId].email = _email;
        registrationProcess[_uniId].uniId = _uniId;
        registrationProcess[_uniId].myAddress = _myAddress;
        registrationProcess[_uniId].role = _role;
        emit logFromSubmission(_name, _email, _uniId, _myAddress, _role);
    }

    /*-----get registration information------*/
    function getRegistrationInformation(string memory _uniId) public view returns(string memory, string memory, string memory, string memory, string memory){
        return(
            registrationProcess[_uniId].name,
            registrationProcess[_uniId].email,
            registrationProcess[_uniId].uniId,
            registrationProcess[_uniId].myAddress,
            registrationProcess[_uniId].role
        );
    }

    /*-------helpers---------*/
    function isAdmin_() public view returns(bool){
        return msg.sender == admin;
    } 

    function notStudent_() public view returns(bool){
        return msg.sender == student;
    } 
}
