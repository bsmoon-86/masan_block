// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.22 < 0.9.0;

contract subcontract {
    // 계약서에 구조를 생성
    struct contract_info{
        string title;
        string contents;
        uint8 state;     // 0인 경우 계약서 등록, 
                        //  1 : 을의 서명 상태, 
                        //  2 : 갑의 서명 계약완료, 
                        //  9 : 계약 거절
        address a_company;
        address b_company;
    }

    // mapping data 생성
    mapping (uint64 => contract_info) internal sub_contract;

    // 배열을 생성 계약의 리스트를 대입
    uint64[] internal contracts;

    function add_contract(
        uint64 _no,
        string memory _title, 
        string memory _contents
        ) public {
            // mapping에 _no  값을 키 값으로 _title, _contracs 구조에 대입
            sub_contract[_no].title = _title;
            sub_contract[_no].contents = _contents;
            // 배열 데이버에 계약서 번호를 추가
            contracts.push(_no);
        }

    function sign_contract(uint64 _no) public {
        // 서명자의 주소를 변수에 대입
        address signer = msg.sender;

        // 해당하는 주소 값을 b_company에 대입
        sub_contract[_no].b_company = signer;
        // 을이 서명을 했으므로 state는 1로 변경
        sub_contract[_no].state = 1;
    }

    function confirm_contract(uint64 _no) public{
        // 서명자의 주소를 변수에 대입
        address confirmer = msg.sender;

        // 해당하는 주소 값을 a_company에 대입
        sub_contract[_no].a_company = confirmer;
        // 갑이 서명을 하여 계약서 완료 되었으므로 state 2
        sub_contract[_no].state = 2;
    }

    function refuse_contract(uint64 _no) public {
        address refuser = msg.sender;

        sub_contract[_no].b_company = refuser;
        sub_contract[_no].state = 9;
    }

    // contract의 내용을 되돌려주는 함수 생성
    function view_contract(uint64 _no) public view returns (
        string memory, string memory, uint8, address, address
    ){
        // mapping에서 해당하는 키 값으로 구조의 각각 값을 변수에 대입
        string memory _title = sub_contract[_no].title;
        string memory _contents = sub_contract[_no].contents;
        uint8 _state = sub_contract[_no].state;
        address _a = sub_contract[_no].a_company;
        address _b = sub_contract[_no].b_company;
        // 
    }
}