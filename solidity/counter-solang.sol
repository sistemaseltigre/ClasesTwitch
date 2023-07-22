import "solana";

@program_id("EzJ5QJn9AcXz3Mu9Ph2MYHiJ5j7ER3fexNeokeWMTYzD")

contract counter_solang {
    address authority;
    uint64 counter;
    
    modifier needs_authority() {
        for (uint64 i = 0; i < tx.accounts.length; i++) {
            AccountInfo ai = tx.accounts[i];

            if (ai.key == authority && ai.is_signer) {
                _;
                return;
            }
        }

        print("not signed by authority");
        revert();
    }

    @payer(payer) 
    constructor(address initial_authority) {
        authority = initial_authority;
    }

    function set_new_authority(address new_authority) needs_authority public {
        authority = new_authority;
    }

    function inc() needs_authority public {
        counter += 1;
    }

    function get() public view returns (uint64) {
        return counter;
    }
}